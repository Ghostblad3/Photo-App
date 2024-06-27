import request from "supertest";
import { server } from "../server";
import {
  createUserTable,
  createPhotoTable,
  dropTables,
  insertUser,
  deleteUser,
  insertPhoto,
  movePhotoToFolder,
  deletePhotoFromFolder,
} from "../testPrepareFunctions";

jest.setTimeout(30000);

describe("Send json with invalid format to an api route", () => {
  test("should return error", async () => {
    const invalidJson = '{tableName="test_table_2024"}';
    const res = await request(server).delete(`/table/delete/${invalidJson}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "invalid JSON format" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Call an api route that doesn't exist", () => {
  test("should return error", async () => {
    const res = await request(server).get("/table/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get table names for user tables", () => {
  beforeAll(() => {
    createUserTable("test_table_2024");
    createUserTable("other_table_2024");
  });

  test("should return success", async () => {
    const res = await request(server).get("/table/names");

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

  afterAll(async () => {
    dropTables(["test_table_2024", "other_table_2024"]);

    server.close();
  });
});

describe("Delete a table that exists", () => {
  beforeAll(async () => {
    createUserTable();
    createPhotoTable();
    await movePhotoToFolder();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/table/delete/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(async () => {
    await deletePhotoFromFolder();
    server.close();
  });
});

describe("Delete a table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/table/delete/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Create a new table", () => {
  test("should return success", async () => {
    const res = await request(server)
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

  afterAll(async () => {
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Create a new table that already exists", () => {
  beforeAll(async () => {
    createUserTable();
    createPhotoTable();
    await movePhotoToFolder();
  });

  test("should return error", async () => {
    const res = await request(server)
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

  afterAll(async () => {
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Count records of users in specific table ", () => {
  beforeAll(() => {
    createUserTable();
    insertUser();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 1,
      error: { message: "" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Count records in table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
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

  afterAll(() => {
    server.close();
  });
});

describe("Count screenshots for users of specific table", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 1,
      error: { message: "" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Get screenshot size of users of specific table", () => {
  beforeAll(async () => {
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

    const res = await request(server).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(Number),
      error: { message: "" },
    });
  });

  afterAll(async () => {
    deleteUser();
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Get screenshot size for table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get column names for users of specific table", () => {
  beforeAll(() => {
    createUserTable();
  });

  test("should return success", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.arrayContaining(["user_asm", "firstName", "lastName"]),
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Get column names for table that doesn't exist", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(() => {
    server.close();
  });
});
