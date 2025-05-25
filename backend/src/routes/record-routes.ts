import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import fs from "fs/promises";
import schemaValidator from "../middleware/schema-validator";
import { sqlite } from "../db-connection/connection";
import {
  tableNameType,
  userPropNameType,
  userPropValueType,
  userType,
  usersType,
} from "../types/types";

const recordRouter = express.Router();

recordRouter.post(
  "/add-users",
  schemaValidator(
    z.object({
      users: usersType,
      tableName: tableNameType,
    }),
  ),
  (req: Request, res: Response) => {
    const {
      users,
      tableName,
    }: {
      users: { [key: string]: string }[];
      tableName: string;
    } = req.body;

    const tableExists = sqlite
      .prepare(
        `select name
         from sqlite_master
         where type = 'table' and name = ?`,
      )
      .get(tableName) as { name: string } | undefined;

    if (!tableExists) {
      throw new Error("table not found");
    }

    const queryResult = sqlite
      .prepare(
        `select name
         from pragma_table_info(?)`,
      )
      .all(tableName) as { name: string }[];

    const columnNames = queryResult.map((item) => item.name);

    const [firstColName, ...rest] = columnNames;

    users.forEach((user, index) => {
      if (user[firstColName] || Object.keys(user).length !== rest.length) {
        throw new Error(`user(${index}) does not have the correct properties`);
      }

      rest.forEach((columnName, index) => {
        if (Object.keys(user).at(index) !== columnName) {
          throw new Error(
            `user(${index}) does not have the correct properties`,
          );
        }
      });
    });

    const idName = Object.keys(users[0]).at(0)!;

    const insertedIds = sqlite
      .prepare(
        `select ${idName}
         from ${tableName}`,
      )
      .all() as { [key: string]: string }[];

    users.forEach((user, index) => {
      if (insertedIds.some((item) => item[idName] === user[idName])) {
        throw new Error(`user(${index}) already exists`);
      }
    });

    let query = sqlite.prepare(
      `insert into ${tableName} (${rest
        .map((columnName) => `${columnName}`)
        .join(",")}) values (${rest.map(() => "?").join(",")})`,
    );

    const tsx = sqlite.transaction((users) => {
      for (const user of users) {
        query.run(Object.values(user));
      }
    });

    tsx(users);

    res.status(201).send({
      status: "success",
      data: {},
      error: { message: "" },
    });
  },
);

recordRouter.delete(
  "/remove-user/tableName/:tableName/userId/:userId/userIdName/:userIdName",
  schemaValidator(
    z.object({
      tableName: tableNameType,
      userId: userPropValueType,
      userIdName: userPropNameType,
    }),
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { userIdName, userId, tableName } = req.params as {
      userIdName: string;
      userId: string;
      tableName: string;
    };

    let columnNames: { name: string }[];

    try {
      columnNames = sqlite
        .prepare(
          `select name
           from pragma_table_info(?)`,
        )
        .all(tableName) as { name: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (columnNames.length === 0) {
      return next(new Error("table not found"));
    }

    columnNames = columnNames.filter((item) => item.name !== "rec_id");

    const firstColumnName = columnNames[0];

    if (firstColumnName.name !== userIdName) {
      return next(new Error("user does not have the correct properties"));
    }

    let photoPath: { path: string };

    try {
      photoPath = sqlite
        .prepare(
          `select path
           from ${tableName}_photos
           inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
           where ${userIdName} = ?`,
        )
        .get(userId) as { path: string };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    let countResult: { count: number };

    try {
      countResult = sqlite
        .prepare(
          `select count(*) as count
           from ${tableName}
           where ${userIdName} = ?`,
        )
        .get(userId) as { count: number };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    const { count } = countResult;

    if (count === 0) {
      return next(new Error("user not found"));
    }

    try {
      sqlite
        .prepare(
          `delete from ${tableName}
           where ${userIdName} = ?`,
        )
        .run(userId);
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    if (photoPath) {
      const { path } = photoPath;

      try {
        await fs.unlink(path);
      } catch (e) {}
    }

    res.status(200).send({
      status: "success",
      data: {},
      error: {
        message: "",
      },
    });
  },
);

recordRouter.get(
  "/get-user-data/tableName/:tableName",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    }),
  ),
  (req: Request, res: Response) => {
    const { tableName } = req.params as { tableName: string };

    let result = sqlite
      .prepare(
        `select *
         from ${tableName}`,
      )
      .all() as { [key: string]: string | number }[];

    result = result.map((user) => {
      delete user.rec_id;
      return user;
    });

    res.status(200).send({
      status: "success",
      data: result,
      error: {
        message: "",
      },
    });
  },
);

recordRouter.delete(
  "/remove-all-users/tableName/:tableName",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    }),
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableName } = req.params as { tableName: string };

    let result: { path: string }[];

    try {
      result = sqlite
        .prepare(
          `select path
           from ${tableName}_photos`,
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
      sqlite.prepare(`delete from ${tableName}`).run();
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res
      .status(200)
      .send({ status: "success", data: {}, error: { message: "" } });
  },
);

recordRouter.patch(
  "/update-user",
  schemaValidator(
    z.object({
      tableName: tableNameType,
      userId: userPropValueType,
      user: userType,
    }),
  ),
  (req: Request, res: Response, next: NextFunction) => {
    const {
      tableName,
      userId,
      user,
    }: {
      tableName: string;
      userId: string;
      user: { [key: string]: string };
    } = req.body;

    let result = sqlite
      .prepare(
        `select name
         from pragma_table_info(?)`,
      )
      .all(tableName) as { name: string }[];

    if (result.length === 0) {
      throw new Error("table not found");
    }

    const columnNames = result
      .map((item) => item.name)
      .filter((item) => item !== "rec_id");

    const firstColumnName = columnNames[0];

    const userKeys = Object.keys(user);
    const userIdName = userKeys[0];

    if (
      firstColumnName !== userIdName ||
      columnNames.length !== userKeys.length
    ) {
      throw new Error("user does not have the correct properties");
    }

    columnNames.forEach((columnName, index) => {
      if (userKeys[index] !== columnName) {
        throw new Error("user does not have the correct properties");
      }
    });

    const countResult = sqlite
      .prepare(
        `select count(*) as count
         from ${tableName}
         where ${firstColumnName} = ?`,
      )
      .get(userId) as { count: number };

    const { count } = countResult;

    if (count === 0) {
      throw new Error("user not found");
    }

    if (userId !== user[firstColumnName]) {
      let result = sqlite
        .prepare(
          `select count(*) as count
           from ${tableName}
           where ${firstColumnName} = ?`,
        )
        .get(user[firstColumnName]) as { count: number };

      const { count } = result!;

      if (count === 1) {
        throw new Error("new user id already exists");
      }
    }

    let query = `update ${tableName} set `;
    let counter = 0;
    let length = Object.keys(user).length;

    for (const key of userKeys) {
      if (columnNames.includes(key) && counter < length - 1) {
        query += `${key} = ?, `;
      } else if (columnNames.includes(key)) {
        query += `${key} = ? `;
      }

      counter++;
    }

    query += `where ${firstColumnName} = ?`;

    sqlite.prepare(query).run(Object.values(user), userId);

    return res.status(200).send({
      status: "success",
      data: {},
      error: { message: "" },
    });
  },
);

recordRouter.all("/*", (_: Request, res: Response) => {
  return res.status(404).send({ error: "route not found" });
});

export default recordRouter;
