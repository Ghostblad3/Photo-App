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
} from "../testPrepareFunctions";

jest.setTimeout(30000);

describe("Call an api route that doesn't exist", () => {
  test("should return error", async () => {
    const res = await request(server).get("/record/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Add users", () => {
  beforeAll(() => {
    createUserTable();
  });

  test("Should return success", async () => {
    const res = await request(server)
      .post("/record/add-users/")
      .send({
        users: [
          {
            user_asm: "123456789",
            firstName: "John",
            lastName: "Doe",
          },
          {
            user_asm: "987654321",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    deleteUser("test_table_2024", "123456789");
    deleteUser("test_table_2024", "987654321");
    dropTables();

    server.close();
  });
});

describe("Add users in table that doesn't exist", () => {
  test("Should return error", async () => {
    const res = await request(server)
      .post("/record/add-users/")
      .send({
        users: [
          {
            user_asm: "123456789",
            firstName: "John",
            lastName: "Doe",
          },
          {
            user_asm: "987654321",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

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

describe("Add users with missing props", () => {
  beforeAll(() => {
    createUserTable();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/record/add-users/")
      .send({
        users: [
          {
            user_asm: "123456789",
          },
          {
            user_asm: "987654321",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Add users with wrong prop names", () => {
  beforeAll(() => {
    createUserTable();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/record/add-users/")
      .send({
        users: [
          {
            asmasm: "123456789",
            name: "John",
            lastName: "Doe",
          },
          {
            asmasm: "987654321",
            name: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Add users with ids that already exist", () => {
  beforeAll(() => {
    createUserTable();
    insertUser("test_table_2024", "123456789");
    insertUser("test_table_2024", "987654321");
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/record/add-users/")
      .send({
        users: [
          {
            user_asm: "123456789",
            firstName: "John",
            lastName: "Doe",
          },
          {
            user_asm: "987654321",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "one or more users already exist" },
    });
  });

  afterAll(() => {
    deleteUser("test_table_2024", "123456789");
    deleteUser("test_table_2024", "987654321");
    dropTables();

    server.close();
  });
});

describe("Get all user data for a specific table", () => {
  beforeAll(() => {
    createUserTable();
    insertUser();
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/record/get-user-data/${JSON.stringify(paramsObj)}`
    );

    expect;

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(Array),
      error: { message: "" },
    });

    const { data } = res.body;

    data.forEach((item: any) => {
      expect(typeof item).toBe("object");

      const keys = Object.keys(item);

      keys.forEach((key) => {
        expect(typeof item[key]).toBe("string");
      });
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Get all user data for a table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/record/get-user-data/${JSON.stringify(paramsObj)}`
    );

    expect;

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

describe("Remove user", () => {
  beforeAll(async () => {
    createUserTable();
    insertUser();
    createPhotoTable();
    insertPhoto();
    await movePhotoToFolder();
  });

  test("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove user that doesn't exist", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove user from table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
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

describe("Remove user with wrong id name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "asmasm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove user with no screenshot", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Remove all users from a table", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser("test_table_2024", "123456789", "John", "Doe");
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-all-users/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove all users from a table that doesn't have any user", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-all-users/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove all users from a table that doesn't have any user with screenshot", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-all-users/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Remove all users from a table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-all-users/${JSON.stringify(paramsObj)}`
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

describe("Update user props", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return success", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });

    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user props with wrong user id", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "999999999",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user props with wrong user prop order", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          firstName: "John",
          user_asm: "123456789",
          lastName: "Doe",
        },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user props for user table that doesn't exist", () => {
  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "999999999",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });
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

describe("Update user props with props missing", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "999999999",
        user: {
          user_asm: "123456789",
          lastName: "Doe",
        },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user props with more props than required", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "999999999",
        user: {
          user_asm: "123456789",
          firstName: "John",
          age: "30",
          lastName: "Doe",
        },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: {
        message:
          "request object has wrong or missing or incorrectly ordered properties",
      },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user props for user that doesn't exist", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Update user props for table that doesn't exist", () => {
  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });

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

describe("Update user props with new user id that already exists", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertUser("test_table_2024", "987654321");
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "987654321",
          firstName: "John",
          lastName: "Doe",
        },
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "new user id already exists" },
    });
  });

  afterAll(() => {
    server.close();
  });
});
