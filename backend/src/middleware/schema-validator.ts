import { Request, Response, NextFunction } from "express";
import z from "zod";

export default function schemaValidator(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { method } = req;

    const { error } = schema.safeParse(
      method === "POST" || method === "PATCH" ? req.body : req.params
    );

    if (error) {
      return res.status(400).send({
        status: "error",
        data: {},
        error: {
          message: JSON.parse(error.message),
        },
      });
    }

    next();
  };
}
