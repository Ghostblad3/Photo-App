import request from "supertest";
import { resetInMemoryDb } from "../database/connection";
import { app } from "../server";
import {
  createUserTable,
  createPhotoTable,
  insertUser,
  insertPhoto,
  movePhotoToFolder,
} from "../testPrepareFunctions";

jest.setTimeout(30000);

beforeEach(() => {
  resetInMemoryDb();
});

describe("Send json with invalid format to an api route", () => {
  test("should return error", async () => {
    const invalidJson = '{tableName="test_table_2024"}';
    const res = await request(app).delete(`/table/delete/${invalidJson}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "invalid JSON format" });
  });
});

describe("Call an api route that doesn't exist", () => {
  test("should return error", async () => {
    const res = await request(app).get("/table/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });
});

describe("Get table names for user tables", () => {
  beforeEach(() => {
    createUserTable("test_table_2024");
    createUserTable("other_table_2024");
  });

  test("should return success", async () => {
    const res = await request(app).get("/table/names");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      status: "success",
      data: expect.arrayContaining([
        expect.objectContaining({ name: "test_table_2024" }),
        expect.objectContaining({ name: "other_table_2024" }),
      ]),
      error: { message: "" },
    });
  });
});

describe("Delete a table that exists", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    await movePhotoToFolder();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      `/table/delete/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Delete a table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      `/table/delete/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Create a new table", () => {
  test("should return success", async () => {
    const res = await request(app)
      .post("/table/create")
      .send({
        tableName: "test_table_2024",
        columnNames: ["firstName", "lastName"],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Create a new table that already exists", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    await movePhotoToFolder();
  });

  test("should return error", async () => {
    const res = await request(app)
      .post("/table/create")
      .send({
        tableName: "test_table_2024",
        columnNames: ["firstName", "lastName"],
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table already exists" },
    });
  });
});

describe("Count records of users in specific table ", () => {
  beforeEach(() => {
    createUserTable();
    insertUser();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 1,
      error: { message: "" },
    });
  });
});

describe("Count records in table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message: "table not found",
      },
    });
  });
});

describe("Count screenshots for users of specific table", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 1,
      error: { message: "" },
    });
  });
});

describe("Get screenshot size of users of specific table", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(Number),
      error: { message: "" },
    });
  });
});

describe("Get screenshot size for table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Get column names for users of specific table", () => {
  beforeEach(() => {
    createUserTable();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.arrayContaining(["user_asm", "firstName", "lastName"]),
      error: { message: "" },
    });
  });
});

describe("Get column names for table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});
