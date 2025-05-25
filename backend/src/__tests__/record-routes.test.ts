import request from "supertest";
import { resetInMemoryDb } from "../db-connection/connection";
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

describe("Call an api route that doesn't exist", () => {
  it("should return error", async () => {
    const res = await request(app).get("/record/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });
});

describe("Add users", () => {
  beforeEach(() => {
    createUserTable();
  });

  it("Should return success", async () => {
    const res = await request(app)
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
});

describe("Add users in table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app)
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
});

describe("Add users with missing props", () => {
  beforeEach(() => {
    createUserTable();
  });

  it("Should return error", async () => {
    const res = await request(app)
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
});

describe("Add users with wrong prop names", () => {
  beforeEach(() => {
    createUserTable();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .post("/record/add-users/")
      .send({
        users: [
          {
            asmasm: "123456789",
            some_name: "John",
            lastName: "Doe",
          },
          {
            asmasm: "987654321",
            some_name: "Jane",
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
});

describe("Add users with ids that already exist", () => {
  beforeEach(() => {
    createUserTable();
    insertUser("test_table_2024", "123456789");
    insertUser("test_table_2024", "987654321");
  });

  it("Should return error", async () => {
    const res = await request(app)
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
});

describe("Get all user data for a specific table", () => {
  beforeEach(() => {
    createUserTable();
    insertUser();
  });

  it("Should return success", async () => {
    const res = await request(app).get(
      "/record/get-user-data/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [
        { user_asm: "123456789", firstName: "peter", lastName: "johnson" },
      ],
      error: { message: "" },
    });
  });
});

describe("Get all user data for a table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app).get(
      "/record/get-user-data/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Remove user", () => {
  beforeEach(async () => {
    createUserTable();
    insertUser();
    createPhotoTable();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return success", async () => {
    const res = await request(app).delete(
      "/record/remove-user/tableName/test_table_2024/userId/123456789/userIdName/user_asm",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Remove user that doesn't exist", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
  });

  it("Should return error", async () => {
    const res = await request(app).delete(
      "/record/remove-user/tableName/test_table_2024/userId/123456789/userIdName/user_asm",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });
});

describe("Remove user from table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app).delete(
      "/record/remove-user/tableName/test_table_2024/userId/123456789/userIdName/user_asm",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Remove user with wrong id name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
  });

  it("Should return error", async () => {
    const res = await request(app).delete(
      "/record/remove-user/tableName/test_table_2024/userId/123456789/userIdName/asmasm",
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
});

describe("Remove user with no screenshot", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return success", async () => {
    const res = await request(app).delete(
      "/record/remove-user/tableName/test_table_2024/userId/123456789/userIdName/user_asm",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Remove all users from a table", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser("test_table_2024", "123456789", "John", "Doe");
  });

  it("Should return success", async () => {
    const res = await request(app).delete(
      "/record/remove-all-users/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Remove all users from a table that doesn't have any user", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
  });

  it("Should return success", async () => {
    const res = await request(app).delete(
      "/record/remove-all-users/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Remove all users from a table that doesn't have any user with screenshot", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return success", async () => {
    const res = await request(app).delete(
      "/record/remove-all-users/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Remove all users from a table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app).delete(
      "/record/remove-all-users/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Update user props", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return success", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          firstName: "John",
          lastName: "Doe",
        },
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Update user props with wrong user id", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props with wrong user prop order", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props for user who belongs in table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props with props missing", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props with more props than required", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "999999999",
        user: {
          user_asm: "123456789",
          firstName: "John",
          some_age: "30",
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
});

describe("Update user props for user that doesn't exist", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props for table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});

describe("Update user props with new user id that already exists", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertUser("test_table_2024", "987654321");
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch(`/record/update-user`)
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
});
