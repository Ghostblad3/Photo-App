import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs/promises";
import sqlite from "./database/connection";
import tableRouter from "./routes/table-routes";
import screenshotRouter from "./routes/screenshot-routes";
import recordRouter from "./routes/record-routes";
import { getErrorCodeAndMessage, errorLogger } from "./utils/util";

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/table", tableRouter);
app.use("/screenshot", screenshotRouter);
app.use("/record", recordRouter);

let counter = 1;
app.get("/test-route", (req, res) => {
  if (counter % 2 === 0) {
    counter++;
    return res.send({ message: "ok" });
  }

  counter++;
  return res.status(500).send({ message: "not ok" });
});

app.use(
  async (
    err: Error & {
      status?: number;
    },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).send({ error: "invalid JSON format" });
    }

    const errorObject = {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params["query"],
      errorName: err.name,
      error: err.message,
    };

    let url = req.url.replace("/", "=");
    if (url.includes("/")) url = url.replace("/", "=");
    if (url.includes("/")) url = url.replace("/", "=");
    if (url.includes("%")) url = url.split("%")[0];

    await fs.appendFile(
      "./logs/reasons.txt",
      `${JSON.stringify(errorObject, null, 2)}\n`
    );

    if (process.env.LOG_ERRORS === "TRUE") {
      errorLogger(errorObject, url, req.method);
    }

    const { statusCode, messageReturned } = getErrorCodeAndMessage(err.message);

    if (messageReturned === "an unexpected error occurred") {
      await fs.appendFile(
        "./logs/unexpected-errors.txt",
        `${JSON.stringify(errorObject, null, 2)}\n`
      );
    }

    return res.status(statusCode).send({
      status: "error",
      data: {},
      error: {
        message: messageReturned,
      },
    });
  }
);

app.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 3000}`
  );

  try {
    await fs.access("./screenshots");
  } catch (e) {
    await fs.mkdir("./screenshots");
  }
});

export { server, sqlite };
