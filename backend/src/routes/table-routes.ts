import express, { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { z } from "zod";
import schemaValidator from "../middleware/validator-middleware";
import { sqlite } from "../database/connection";
import { getAverageScreenshotSizeInDirectory } from "../utils/util";
import { tableNameType, columnNamesType } from "../zod/zod-types";
import { Transaction } from "better-sqlite3";

const tableRouter = express.Router();

tableRouter.get("/names", (_, res: Response) => {
  let data = sqlite
    .prepare(
      `select name
      from sqlite_master
      where type='table';`
    )
    .all() as { name: string }[];

  data = data.filter(
    (item) => item.name !== "sqlite_sequence" && !item.name.endsWith("_photos")
  );

  return res
    .status(200)
    .send({ status: "success", data, error: { message: "" } });
});

tableRouter.post(
  "/create",
  schemaValidator(
    z.object({
      tableName: tableNameType,
      columnNames: columnNamesType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      tableName,
      columnNames,
    }: { tableName: string; columnNames: string[] } = req.body;

    let queryA = `create table ${tableName} (rec_id integer not null,`;

    columnNames.forEach((columnName, index) => {
      queryA += `${columnName} text not null ${index === 0 ? "unique" : ""},`;
    });

    queryA += `primary key("rec_id"));`;

    const queryB = `create table ${tableName}_photos (
      photo_id integer not null,
      dayNumber text not null,
      path text not null unique,
      photo_timestamp text not null,
      rec_id integer not null unique,
      primary key("photo_id"),
      foreign key("rec_id") references ${tableName}("rec_id") on delete cascade);`;

    let tsx: Transaction<() => void>;

    // create table if not exists (no error if table already exists)
    tsx = sqlite.transaction(() => {
      sqlite.prepare(queryA).run();
      sqlite.prepare(queryB).run();
    });

    try {
      tsx();
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    try {
      await fs.mkdir(`./screenshots/${tableName}`);
    } catch (e) {
      sqlite.prepare(`drop table "${tableName}"`).run();

      return next(new Error("error occured during creating table folder"));
    }

    return res
      .status(201)
      .send({ status: "success", data: {}, error: { message: "" } });
  }
);

tableRouter.delete(
  "/delete/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result: { path: string }[];

    try {
      result = sqlite
        .prepare(
          `select path
          from "${tableName}_photos"`
        )
        .all() as { path: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    for (const { path } of result) {
      try {
        await fs.unlink(path);
      } catch (e) {}
    }

    try {
      await fs.rm(`./screenshots/${tableName}`, {
        recursive: true,
        force: true,
      });
    } catch (e) {}

    let tsx: Transaction<() => void>;

    tsx = sqlite.transaction(() => {
      sqlite.prepare(`drop table if exists "${tableName}_photos"`).run();
      sqlite.prepare(`drop table if exists "${tableName}"`).run();
    });

    try {
      tsx();
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res
      .status(200)
      .send({ status: "success", data: {}, error: { message: "" } });
  }
);

tableRouter.get(
  "/count-records/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    const result = sqlite
      .prepare(
        `select count(*) as count 
        from "${tableName}"`
      )
      .get() as { count: number };

    const { count } = result;

    return res.status(200).send({
      status: "success",
      data: count,
      error: { message: "" },
    });
  }
);

tableRouter.get(
  "/count-screenshots/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    const result = sqlite
      .prepare(
        `select count(*) as count
        from "${tableName}_photos"`
      )
      .get() as { count: number };

    const { count } = result;

    return res.status(200).send({
      status: "success",
      data: count,
      error: { message: "" },
    });
  }
);

tableRouter.get(
  "/screenshots-size/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result: { name: string }[];

    try {
      result = sqlite
        .prepare(
          `select name
          from sqlite_master
          where type='table';`
        )
        .all() as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const mapedResult = result
      .filter((item) => !item.name.endsWith("_photos"))
      .map((item) => item.name);

    if (!mapedResult.includes(tableName)) {
      return next(new Error("table not found"));
    }

    let averageBytes: number | null = null;

    try {
      await fs.access(`./screenshots/${tableName}`);
      averageBytes = await getAverageScreenshotSizeInDirectory(
        `./screenshots/${tableName}`
      );
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res.status(200).send({
      status: "success",
      data: averageBytes ? averageBytes : 0,
      error: { message: "" },
    });
  }
);

tableRouter.get(
  "/table-column-names/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    const result = sqlite
      .prepare(
        `select name
        from pragma_table_info(?)`
      )
      .all(tableName) as { name: string }[];

    if (result.length === 0) {
      throw new Error("table not found");
    }

    const columnNames = result
      .map((item) => item.name)
      .filter((item) => item !== "rec_id");

    return res.status(200).send({
      status: "success",
      data: columnNames,
      error: { message: "" },
    });
  }
);

tableRouter.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

export default tableRouter;
