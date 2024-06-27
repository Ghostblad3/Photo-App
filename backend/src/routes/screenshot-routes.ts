import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import fs from "fs/promises";
import crypto from "crypto";
import schemaValidator from "../middleware/validator-middleware";
import sqlite from "../database/connection";
import {
  userIdType,
  tableNameType,
  dayNumberType,
  userIdNameType,
  screenshotType,
} from "../zod/zod-types";

const screenshotRouter = express.Router();

// Adds the screenshot of a user
screenshotRouter.post(
  "/add-user-screenshot",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      dayNumber: dayNumberType,
      tableName: tableNameType,
      screenshot: screenshotType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      userIdName,
      userId,
      dayNumber,
      tableName,
      screenshot,
    }: {
      userIdName: string;
      userId: string;
      dayNumber: string;
      tableName: string;
      screenshot: { type: "Buffer"; data: Buffer };
    } = req.body;

    let columnNames;

    try {
      columnNames = sqlite
        .prepare(`select name from pragma_table_info(?)`)
        .all(tableName) as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (columnNames.length === 0) {
      return next(new Error("table not found"));
    }

    columnNames = columnNames.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    const [firstColumn] = columnNames;

    const { name } = firstColumn;

    if (name !== userIdName) {
      return next(new Error("user does not have the correct properties"));
    }

    let result;

    try {
      result = sqlite
        .prepare(
          `select count(*) as count
          from "${tableName}"
          where ${userIdName} = ?`
        )
        .get(userId) as { count: number };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const { count } = result;

    if (count === 0) {
      return next(new Error("user not found"));
    }

    let screenshotFolderExists = false;
    let tableFolderExists = false;

    try {
      await fs.access("./screenshots");
      screenshotFolderExists = true;
    } catch (e) {}

    if (!screenshotFolderExists) {
      try {
        await fs.mkdir("./screenshots");
      } catch (e) {
        return next(new Error((e as Error).toString()));
      }
    }

    try {
      await fs.access(`./screenshots/${tableName}`);
      tableFolderExists = true;
    } catch (e) {}

    if (!tableFolderExists) {
      try {
        await fs.mkdir(`./screenshots/${tableName}`);
      } catch (e) {
        return next(new Error((e as Error).toString()));
      }
    }

    const buffer = Buffer.from(screenshot.data);
    let hash;

    try {
      hash = crypto.createHash("md5").update(buffer).digest("hex");
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const screenshotFilePath = `./screenshots/${tableName}/${hash}.png`;

    try {
      await fs.writeFile(screenshotFilePath, buffer, {
        encoding: "utf8",
      });
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    let idResult;

    try {
      idResult = sqlite
        .prepare(
          `select rec_id
          from "${tableName}"
          where ${userIdName} = ?`
        )
        .get(userId) as { rec_id: string };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const { rec_id } = idResult;

    try {
      sqlite
        .prepare(
          `insert into "${tableName}_photos"
          (dayNumber, path, photo_timestamp, rec_id) values (?, ?, ?, ?)`
        )
        .run(dayNumber, screenshotFilePath, new Date().toISOString(), rec_id);
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res.status(201).send({
      status: "success",
      data: {},
      error: { message: "" },
    });
  }
);

// Delete the screenshot of a user
screenshotRouter.delete(
  "/delete-user-screenshot/:query",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      userIdName,
      userId,
      tableName,
    }: { userIdName: string; userId: string; tableName: string } = JSON.parse(
      req.params["query"]
    );

    let columnNames;

    try {
      columnNames = sqlite
        .prepare(
          `select name 
          from pragma_table_info(?)`
        )
        .all(tableName) as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (columnNames.length === 0) {
      return next(new Error("table not found"));
    }

    columnNames = columnNames.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    const [firstColumn] = columnNames;
    const { name } = firstColumn;

    if (name !== userIdName) {
      return next(new Error("user does not have the correct properties"));
    }

    let exists;

    try {
      exists = sqlite
        .prepare(
          `select count(*) as count
          from "${tableName}"
          where ${userIdName} = ?`
        )
        .get(userId) as { count: number };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const { count } = exists;

    if (count === 0) {
      return next(new Error("user not found"));
    }

    let result;

    try {
      result = sqlite
        .prepare(
          `select path, ${tableName}.rec_id from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
          where ${tableName}.${userIdName} = ?`
        )
        .get(userId) as { path: string; rec_id: string } | undefined;
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (!result) {
      return next(new Error("screenshot not found"));
    }

    const { path, rec_id } = result;

    try {
      await fs.unlink(path);
    } catch (e) {}

    try {
      sqlite
        .prepare(
          `delete from ${tableName}_photos
          where rec_id = ?`
        )
        .run(rec_id);
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res.status(200).send({
      status: "success",
      data: {},
      error: { message: "" },
    });
  }
);

// Update the date of the screenshot
screenshotRouter.post(
  "/update-user-screenshot-date",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      dayNumber: dayNumberType,
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const {
      userIdName,
      userId,
      dayNumber,
      tableName,
    }: {
      userIdName: string;
      userId: string;
      dayNumber: string;
      tableName: string;
    } = req.body;

    let columnNames;
    columnNames = sqlite
      .prepare(
        `select name
        from pragma_table_info(?)`
      )
      .all(tableName) as { name: string }[];

    if (columnNames.length === 0) {
      throw new Error("table not found");
    }

    columnNames = columnNames.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    const [firstColumn] = columnNames;
    const { name } = firstColumn;

    if (name !== userIdName) {
      throw new Error("user does not have the correct properties");
    }

    const idResult = sqlite
      .prepare(
        `select rec_id from ${tableName} 
        where ${name} = ?`
      )
      .get(userId) as { rec_id: string } | undefined;

    if (!idResult) {
      throw new Error("user not found");
    }

    const { rec_id } = idResult;

    sqlite
      .prepare(
        `update "${tableName}_photos" 
        set dayNumber = ? 
        where rec_id = ?`
      )
      .run(dayNumber, rec_id);

    return res.status(204).send({});
  }
);

// Retrieves the screenshots of users for a specific table for a given date
screenshotRouter.get(
  "/retrieve-user-screenshots-single-day/:query",
  schemaValidator(
    z.object({
      dayNumber: dayNumberType,
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName, dayNumber }: { tableName: string; dayNumber: string } =
      JSON.parse(req.params["query"]);

    let result;

    try {
      result = sqlite
        .prepare(
          `select * from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
          where dayNumber = ?`
        )
        .all(dayNumber) as {
        [key: string]: string;
        photo_id: string;
        rec_id: string;
        dayNumber: string;
        path: string;
      }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const final: {
      [key: string]: string;
    }[] = [];

    try {
      for (const element of result) {
        let tempObj: { [key: string]: string } = {};

        Object.keys(element).forEach((key) => {
          if (key !== "path") {
            tempObj[key] = element[key];
          }
        });

        tempObj.screenshot = (
          await fs.readFile(element.path!, { encoding: "base64" })
        ).toString()!;

        final.push(tempObj);
      }
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res.status(200).send({
      status: "success",
      data: final,
      error: { message: "" },
    });
  }
);

// Retrieves the submitted days for a given table
screenshotRouter.get(
  "/retrieve-submitted-days/:query",
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
        `select dayNumber
        from ${tableName}_photos
        group by dayNumber`
      )
      .all() as { dayNumber: string }[];

    const days = result.map(({ dayNumber }) => dayNumber);

    return res.status(200).send({
      status: "success",
      data: days,
      error: { message: "" },
    });
  }
);

// Retrieves the screenshots of users of specific table for all days
screenshotRouter.get(
  "/retrieve-user-screenshots-all-days/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result;

    try {
      result = sqlite
        .prepare(
          `select * from ${tableName}
          inner join ${tableName}_photos on ${tableName}_photos.photo_id = ${tableName}.rec_id`
        )
        .all() as {
        [key: string]: string;
        photo_id: string;
        rec_id: string;
        dayNumber: string;
        path: string;
      }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const final: {
      [key: string]: string;
    }[] = [];

    for (const element of result) {
      let tempObj: { [key: string]: string } = {};

      Object.keys(element).forEach((key) => {
        if (key !== "path" && key !== "rec_id" && key !== "photo_id") {
          tempObj[key] = element[key];
        }
      });

      try {
        await fs.access(element.path!);
        tempObj.screenshot = (
          await fs.readFile(element.path!, { encoding: "base64" })
        ).toString()!;
      } catch (e) {
        try {
          sqlite
            .prepare(
              `delete from ${tableName}_photos
              where rec_id = ?`
            )
            .run(element.rec_id);
        } catch (e) {
          return next(new Error((e as Error).toString()));
        }
      }

      final.push(tempObj);
    }

    return res.status(200).send({
      status: "success",
      data: final,
      error: { message: "" },
    });
  }
);

screenshotRouter.get(
  "/retrieve-user-screenshot/:query",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      userIdName,
      userId,
      tableName,
    }: { userIdName: string; userId: string; tableName: string } = JSON.parse(
      req.params["query"]
    );
    let columnNames;

    try {
      columnNames = sqlite
        .prepare(
          `select name 
          from pragma_table_info(?)`
        )
        .all(tableName) as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (columnNames.length === 0) {
      return next(new Error("table not found"));
    }

    columnNames = columnNames.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    const [firstColumn] = columnNames;

    if (firstColumn.name !== userIdName) {
      return next(new Error("user does not have the correct properties"));
    }

    let exists;

    try {
      exists = sqlite
        .prepare(
          `select count(*) as count, rec_id
          from ${tableName}
          where ${tableName}.${userIdName} = ?`
        )
        .get(userId) as {
        count: number;
        rec_id: string;
      };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const { count } = exists;

    if (count === 0) {
      return next(new Error("user not found"));
    }

    let result;

    try {
      result = sqlite
        .prepare(
          `select path from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
          where ${tableName}.${userIdName} = ?`
        )
        .get(userId) as
        | {
            path: string;
          }
        | undefined;
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (!result) {
      return next(new Error("screenshot not found"));
    }

    const { path } = result;
    let screenshot: string;

    try {
      await fs.access(path);
      screenshot = await fs.readFile(path, { encoding: "base64" })!;
    } catch (e) {
      const { rec_id } = exists;

      try {
        sqlite
          .prepare(`delete from ${tableName}_photos where rec_id = ?`)
          .run(rec_id);
      } catch (e) {
        return next(new Error((e as Error).toString()));
      }

      return next(new Error("screenshot not found"));
    }

    return res.status(200).send({
      status: "success",
      data: screenshot,
      error: { message: "" },
    });
  }
);

screenshotRouter.get(
  "/retrieve-user-data-with-screenshots/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let columnNamesResult;

    try {
      columnNamesResult = sqlite
        .prepare(
          `select name
          from pragma_table_info(?)`
        )
        .all(tableName) as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    columnNamesResult = columnNamesResult.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    let query = `select `;

    columnNamesResult.forEach((columnName) => {
      query = query + ` ${columnName.name},`;
    });

    let result;

    try {
      result = sqlite
        .prepare(
          `select * from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id`
        )
        .all() as {
        [key: string]: string | number;
        rec_id: number;
        path: string;
        photo_id: number;
        dayNumber: string;
        photo_timestamp: string;
      }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    let final: { [key: string]: string }[] = [];

    result.forEach((element) => {
      let tempObj: { [key: string]: string } = {};

      Object.assign(tempObj, element);

      delete tempObj!.rec_id;
      delete tempObj!.photo_id;
      delete tempObj!.path;

      final.push(tempObj);
    });

    return res.status(200).send({
      status: "success",
      data: final,
      error: { message: "" },
    });
  }
);

screenshotRouter.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

export default screenshotRouter;
