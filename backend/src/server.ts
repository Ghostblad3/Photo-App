import express, { Express, Request, Response, NextFunction } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import helmet from "helmet";
import cors from "cors";
import fs from "fs/promises";
import dotenv from "dotenv";
import { getErrorCodeAndMessage, errorLogger } from "./utils/utils";
import tableRouter from "./routes/table-routes";
import screenshotRouter from "./routes/screenshot-routes";
import recordRouter from "./routes/record-routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.disable("x-powered-by");

app.use("/table", tableRouter);
app.use("/screenshot", screenshotRouter);
app.use("/record", recordRouter);

app.use(
  async (
    err: Error & {
      status?: number;
    },
    req: Request,
    res: Response,
    _next: NextFunction,
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
      `${JSON.stringify(errorObject, null, 2)}\n`,
    );

    if (process.env.LOG_ERRORS === "TRUE") {
      await errorLogger(errorObject, url, req.method);
    }

    const { statusCode, messageReturned } = getErrorCodeAndMessage(err.message);

    if (messageReturned === "an unexpected error occurred") {
      await fs.appendFile(
        "./logs/unexpected-errors.txt",
        `${JSON.stringify(errorObject, null, 2)}\n`,
      );
    }

    return res.status(statusCode).send({
      status: "error",
      data: {},
      error: {
        message: messageReturned,
      },
    });
  },
);

app.all("/*", (_: Request, res: Response) => {
  return res.status(404).send({ error: "route not found" });
});

let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined =
  undefined;

begin();

async function begin() {
  if (process.env.ENVIRONMENT === "TEST") return;

  await startServer();
}

async function startServer() {
  if (!server) {
    server = app.listen(process.env.PORT ?? 3000, async () => {
      console.log(
        `Server is running at http://localhost:${process.env.PORT ?? 3000}!`,
      );

      await fs.mkdir("./screenshots", { recursive: true });
    });
  }

  return server;
}

async function closeServer() {
  if (!server) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    server?.close((err) => {
      if (err) {
        reject();
      }

      console.log("Closing gracefully");

      resolve();
    });
  });
}

export { startServer, closeServer, app };
