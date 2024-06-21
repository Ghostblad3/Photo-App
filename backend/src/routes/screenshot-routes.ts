import express, { Request, Response } from "express";
import { string, z } from "zod";
import fs from "fs/promises";
import crypto from "crypto";
import schemaValidator from "../middleware/validator-middleware";
import sqlite from "../database/connection";
import {
  userIdType,
  tableNameType,
  dayNumberType,
  screenshotType,
  userIdNameType,
} from "../zod/zod-types";

const screenshotRouter = express.Router();

// Adds the screenshot of a user
screenshotRouter.post(
  "/add-user-screenshot",
  schemaValidator(
    z.object({
      userId: userIdType,
      dayNumber: dayNumberType,
      tableName: tableNameType,
      screenshot: screenshotType,
    })
  ),
  async (req: Request, res: Response) => {
    const {
      userId,
      dayNumber,
      tableName,
      screenshot,
    }: {
      userId: string;
      dayNumber: string;
      tableName: string;
      screenshot: any | Buffer;
    } = req.body;

    const screenshotAsTxt = await fs.readFile(
      "./screenshot-as-txt/screenshot.txt"
    );

    const screenshot_temp = Buffer.from(screenshotAsTxt);

    let result;

    try {
      result = sqlite
        .prepare(
          `select count(*) as count
          from "${tableName}"
          where rec_id = ?`
        )
        .get(userId) as { count: number };
    } catch (e) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "error occured" },
      });
    }

    const { count } = result;

    if (count === 0) {
      return res.send({
        status: "error",
        data: {},
        error: {
          message: "user not found",
        },
      });
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
        return res.send({
          status: "error",
          data: {},
          error: {
            message: "error occured",
          },
        });
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
        return res.send({
          status: "error",
          data: {},
          error: {
            message: "error occured",
          },
        });
      }
    }

    const hash = crypto.createHash("md5").update(screenshot_temp).digest("hex");

    const screenshotFilePath = `./screenshots/${tableName}/${hash}.png`;

    await fs.writeFile(
      `./screenshots/${tableName}/${hash}.png`,
      screenshot_temp
    );

    try {
      sqlite
        .prepare(
          `insert into "${tableName}_photos"
          (dayNumber, path, photo_timestamp, rec_id) values (?, ?, ?, ?)`
        )
        .run(dayNumber, screenshotFilePath, new Date().toISOString(), userId);
    } catch (error) {
      return res.send({
        status: "error",
        data: {},
        error: {
          message: "could not add screenshot to database",
        },
      });
    }

    return res.send({
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
  async (req: Request, res: Response) => {
    const {
      userIdName,
      userId,
      tableName,
    }: { userIdName: string; userId: string; tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result;

    try {
      result = sqlite
        .prepare(
          `select path from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
          where ${tableName}.${userIdName} = ?`
        )
        .get(userId) as { path: string } | undefined;
    } catch (e) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "error occured" },
      });
    }

    if (!result) {
      return res.send({
        status: "error",
        data: {},
        error: {
          message: "screenshot not found",
        },
      });
    }

    const { path } = result;

    if (!path) {
      return res.send({
        status: "error",
        data: {},
        error: {
          message: "screenshot not found",
        },
      });
    }

    try {
      await fs.unlink(path); // Should be done periodically by server

      sqlite
        .prepare(
          `delete from ${tableName}_photos
          where ${userIdName} = ?`
        )
        .run(userId);
    } catch (e) {
      return res.send({
        status: "error",
        data: {},
        error: {
          message: "could not delete screenshot from database",
        },
      });
    }

    return res.send({
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
      userId: userIdType,
      dayNumber: dayNumberType,
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const {
      userId,
      dayNumber,
      tableName,
    }: { userId: string; dayNumber: string; tableName: string } = req.body;

    try {
      sqlite
        .prepare(
          `update "${tableName}_photos" set dayNumber = ? 
          where rec_id = ?`
        )
        .run(dayNumber, userId);
    } catch (error) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "could not update screenshot date" },
      });
    }

    return res.send({
      status: "success",
      data: {},
      error: { message: "" },
    });
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
  async (req: Request, res: Response) => {
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
      return res.send({
        status: "error",
        data: {},
        error: { message: "error occured" },
      });
    }

    const final: {
      [key: string]: string;
    }[] = [];

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

    return res.send({
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

    let result;

    try {
      result = sqlite
        .prepare(
          `select dayNumber
          from ${tableName}_photos
          group by dayNumber`
        )
        .all() as { dayNumber: string }[];
    } catch (e) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "error occured" },
      });
    }

    return res.send({
      status: "success",
      data: result,
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
  async (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result = sqlite
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

      tempObj.screenshot = (
        await fs.readFile(element.path!, { encoding: "base64" })
      ).toString()!;

      final.push(tempObj);
    }

    return res.send({
      status: "success",
      data: final,
      error: { message: "" },
    });
  }
);

// {"userIdName":"user_asm","userId":"1020489","tableName":"table_2024"}

screenshotRouter.get(
  "/retrieve-user-screenshot/:query",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response) => {
    const {
      userIdName,
      userId,
      tableName,
    }: { userIdName: string; userId: string; tableName: string } = JSON.parse(
      req.params["query"]
    );

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
      return res.send({
        status: "error",
        data: {},
        error: { message: "error occured" },
      });
    }

    if (!result) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "screenshot not found" },
      });
    }

    let screenshot: string;

    try {
      screenshot = await fs.readFile(result.path!, { encoding: "base64" })!;
    } catch (e) {
      return res.send({
        status: "error",
        data: {},
        error: { message: "screenshot not found" },
      });
    }

    return res.send({
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
  async (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let columnNamesResult = sqlite
      .prepare(
        `select name
        from pragma_table_info(?)`
      )
      .all(tableName) as { name: string }[];

    columnNamesResult = columnNamesResult.filter(
      (columnName) => columnName.name !== "rec_id"
    );

    let query = `select `;

    columnNamesResult.forEach((columnName) => {
      query = query + ` ${columnName.name},`;
    });

    const result = sqlite
      .prepare(
        `${query} dayNumber, photo_timestamp from ${tableName}_photos
        inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id`
      )
      .all() as {
      [key: string]: string;
      dayNumber: string;
      photo_timestamp: string;
    }[];

    return res.send({
      status: "success",
      data: result,
      error: { message: "" },
    });
  }
);

screenshotRouter.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

export default screenshotRouter;
