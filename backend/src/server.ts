import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs/promises";
import tableRouter from "./routes/table-routes";
import screenshotRouter from "./routes/screenshot-routes";
import recordRouter from "./routes/record-routes";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 }));
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
    next: NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).send({ error: "invalid JSON format" });
    }

    const time = new Date()
      .toISOString()
      .replace(".", "-")
      .replace(":", "-")
      .replace(":", "-");

    const errorObject = {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params["query"],
      errorName: err.name,
      error: err.message,
    };

    if (false) {
      await fs.writeFile(
        `./logs/${time}.txt`,
        JSON.stringify(errorObject, null, 2)
      );
    }

    if (err.name === "SqliteError") {
      if (err.message.includes("")) {
      } else if (err.message.includes("")) {
      }
    } else if (err.name === "Error") {
    }

    return res.status(500).send({
      status: "error",
      data: {},
      error: {
        message: err.message,
      },
    });
  }
);

app.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

const server = app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  try {
    await fs.access("./screenshots");
  } catch (e) {
    await fs.mkdir("./screenshots");
  }
});

export default server;
