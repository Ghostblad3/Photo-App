import request from "supertest";
import server from "../server";

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("Invalid json format", () => {
  test("should return error", async () => {
    const res = await request(server).delete(
      `/table/delete/${"{tableName=mock_table_2024}"}`
    );
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "invalid JSON format" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Unregisted route", () => {
  test("should return error", async () => {
    const res = await request(server).get("/random-route/user");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get table names", () => {
  test("should return success", async () => {
    const res = await request(server).get("/table/names");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      status: "success",
      data: expect.arrayContaining([
        expect.objectContaining({ name: "table_2024" }),
        expect.objectContaining({ name: "mock_table_2024" }),
        expect.objectContaining({ name: "test_table_2024" }),
      ]),
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Delete a table that exists", () => {
  test("should return success", async () => {
    const obj = {
      tableName: "mock_table_2024",
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

  afterAll(() => {
    server.close();
  });
});

describe("Create a new table", () => {
  test("should return success", async () => {
    const res = await request(server)
      .post("/table/create")
      .send({
        tableName: "mock_table_2024",
        columnNames: ["firstName", "lastName"],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Create a new table that already exists", () => {
  test("should return error", async () => {
    const res = await request(server)
      .post("/table/create")
      .send({
        tableName: "mock_table_2024",
        columnNames: ["firstName", "lastName"],
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Count records in mock_table_2024", () => {
  test("should return success", async () => {
    const obj = {
      tableName: "mock_table_2024",
    };

    const res = await request(server).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 0,
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Count records in unknown table", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "unknown_table",
    };

    const res = await request(server).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message: expect.any(String),
      },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Count screenshots in mock_table_2024", () => {
  test("should return success", async () => {
    const obj = {
      tableName: "mock_table_2024",
    };

    const res = await request(server).get(
      `/table/count-records/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 0,
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get screenshot size for mock_table_2024", () => {
  test("should return success", async () => {
    const obj = {
      tableName: "mock_table_2024",
    };

    const res = await request(server).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: 0,
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get screenshot size for unknown table", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "uknown_table",
    };

    const res = await request(server).get(
      `/table/screenshots-size/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get column names for known table", () => {
  test("should return success", async () => {
    const obj = {
      tableName: "mock_table_2024",
    };

    const res = await request(server).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: ["firstName", "lastName"],
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Get column names for unknown table", () => {
  test("should return error", async () => {
    const obj = {
      tableName: "unknown_table",
    };

    const res = await request(server).get(
      `/table/table-column-names/${JSON.stringify(obj)}`
    );

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
  });

  afterAll(() => {
    server.close();
  });
});
