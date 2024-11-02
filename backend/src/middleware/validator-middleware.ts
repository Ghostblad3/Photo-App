import { Request, Response, NextFunction } from "express";
import z from "zod";

export default function schemaValidator(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { method } = req;

    let validationResult;

    try {
      validationResult = schema.safeParse(
        method === "POST" || method === "PATCH"
          ? req.body
          : JSON.parse(req.params["query"])
      );
    } catch (e) {
      return res.status(400).send({ error: "invalid JSON format" });
    }

    if (validationResult.error) {
      return res.status(400).send({
        status: "error",
        data: {},
        error: {
          message: JSON.parse(validationResult.error.message),
        },
      });
    }

    next();
  };
}
