import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import fs from "fs/promises";
import schemaValidator from "../middleware/validator-middleware";
import sqlite from "../database/connection";
import {
  tableNameType,
  userIdNameType,
  userIdType,
  userType,
  usersType,
} from "../zod/zod-types";

const recordRouter = express.Router();

recordRouter.post(
  "/add-users",
  schemaValidator(
    z.object({
      users: usersType,
      tableName: tableNameType,
    })
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
          where type = 'table' and name = ?;`
      )
      .get(tableName) as { name: string } | undefined;

    if (!tableExists) {
      throw new Error("table not found");
    }

    const queryResult = sqlite
      .prepare(
        `select name
          from pragma_table_info(?)`
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
            `user(${index}) does not have the correct properties`
          );
        }
      });
    });

    const idName = Object.keys(users[0]).at(0)!;

    const insertedIds = sqlite
      .prepare(
        `select ${idName}
          from ${tableName}`
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
        .join(",")}) values (${rest.map(() => "?").join(",")});`
    );

    const tsx = sqlite.transaction((users) => {
      for (const user of users) {
        query.run(Object.values(user));
      }
    });

    tsx(users);

    res.send({
      status: "success",
      data: {},
      error: { message: "" },
    });
  }
);

// recordRouter.post(
//   "/add-new-user",
//   schemaValidator(
//     z.object({
//       tableName: tableNameType,
//       user: userType,
//     })
//   ),
//   (req: Request, res: Response) => {
//     const {
//       tableName,
//       user,
//     }: {
//       tableName: string;
//       user: { [key: string]: string };
//     } = req.body;

//     const tableExists = sqlite
//       .prepare(
//         `select name
//           from sqlite_master
//           where type = 'table' and name = ?`
//       )
//       .get(tableName) as { name: string } | undefined;

//     if (!tableExists) {
//       throw new Error("table not found");
//     }

//     const queryResult = sqlite
//       .prepare(
//         `select name
//           from PRAGMA_TABLE_INFO(?)`
//       )
//       .all(tableName) as { name: string }[];

//     const columnNames = queryResult.map((item) => item.name);

//     const [firstColName, ...rest] = columnNames;

//     if (user[firstColName] || Object.keys(user).length !== rest.length) {
//       throw new Error("user does not have the correct properties");
//     }

//     rest.forEach((columnName) => {
//       if (!user[columnName]) {
//         throw new Error("user does not have the correct properties");
//       }
//     });

//     const [secondColName, _] = rest;

//     const result = sqlite
//       .prepare(
//         `select count(*) as count
//           from ${tableName}
//           where ${secondColName} = ?`
//       )
//       .get(user[secondColName]) as { count: number };

//     const { count } = result;

//     if (count > 0) {
//       throw new Error("user already exists");
//     }

//     sqlite
//       .prepare(
//         `insert into ${tableName} (${rest
//           .map((columnName) => `${columnName}`)
//           .join(",")}) values (${rest.map(() => "?").join(",")})`
//       )
//       .run(Object.values(user));

//     return res.send({
//       status: "success",
//       data: {},
//       error: {
//         message: "",
//       },
//     });
//   }
// );

recordRouter.delete(
  "/remove-user/:query",
  schemaValidator(
    z.object({
      userIdName: userIdNameType,
      userId: userIdType,
      tableName: tableNameType,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { userIdName, userId, tableName } = JSON.parse(
      req.params["query"]
    ) as {
      userIdName: string;
      userId: string;
      tableName: string;
    };

    let photoPath;

    try {
      photoPath = sqlite
        .prepare(
          `select path
          from ${tableName}_photos
          inner join ${tableName} on ${tableName}_photos.rec_id = ${tableName}.rec_id
          where ${userIdName} = ?`
        )
        .get(userId) as { path: string };
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    let countResult;

    try {
      countResult = sqlite
        .prepare(
          `select count(*) as count from ${tableName}
          where ${userIdName} = ?`
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
          where ${userIdName} = ?`
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

    res.send({
      status: "success",
      data: {},
      error: {
        message: "",
      },
    });
  }
);

recordRouter.get(
  "/get-user-data/:query",
  schemaValidator(
    z.object({
      tableName: tableNameType,
    })
  ),
  (req: Request, res: Response) => {
    const { tableName }: { tableName: string } = JSON.parse(
      req.params["query"]
    );

    let result = sqlite
      .prepare(
        `select *
          from ${tableName}`
      )
      .all() as { [key: string]: string }[];

    result = result.map((user) => {
      delete user.rec_id;
      return user;
    });

    res.send({
      status: "success",
      data: result,
      error: {
        message: "",
      },
    });
  }
);

recordRouter.delete(
  "/remove-all-users/:query",
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
          `select path
          from ${tableName}_photos`
        )
        .all() as { path: string }[];
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    for (const { path } of result!) {
      try {
        await fs.unlink(path);
      } catch (e) {}
    }

    try {
      sqlite.prepare(`delete from ${tableName}`).run();
    } catch (e) {
      return next(new Error((e as Error).toString()));
    }

    return res.send({ status: "success", data: {}, error: { message: "" } });
  }
);

recordRouter.post(
  "/update-user",
  schemaValidator(
    z.object({
      tableName: tableNameType,
      userId: userIdType,
      user: userType,
    })
  ),
  (req: Request, res: Response, next: NextFunction) => {
    const {
      tableName,
      userId,
      user,
    }: { tableName: string; userId: string; user: { [key: string]: string } } =
      req.body;

    let result = sqlite
      .prepare(
        `select name
          from pragma_table_info(?)`
      )
      .all(tableName) as { name: string }[];

    const columnNames = result!
      .map((item) => item.name)
      .filter((item) => item !== "rec_id");

    const userKeys = Object.keys(user);

    if (columnNames.length !== userKeys.length) {
      throw new Error("user does not have the correct properties");
    }

    columnNames.forEach((columnName, index) => {
      if (userKeys[index] !== columnName) {
        throw new Error("user does not have the correct properties");
      }
    });

    if (userId !== user[columnNames[0]]) {
      let result = sqlite
        .prepare(
          `select count(*) as count
            from ${tableName}
            where ${columnNames[0]} = ?`
        )
        .get(user[columnNames[0]]) as { count: number };

      const { count } = result!;

      if (count === 1) {
        throw new Error("there is another user with that id");
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

    query += `where ${userKeys[0]} = ?`;

    sqlite.prepare(query).run(Object.values(user), userId);

    return res.send({
      status: "success",
      data: {},
      error: {
        message: "",
      },
    });
  }
);

recordRouter.all("/*", (_: Request, res: Response) => {
  res.status(404).send({ error: "route not found" });
});

export default recordRouter;
