import request from "supertest";
import server from "../server";

describe("Add users", () => {
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
            user_asm: "767676789",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
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

describe("Add user that already exists", () => {
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
        ],
        tableName: "test_table_2024",
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

describe("Get all user data for a specific table", () => {
  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/record/get-user-data/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.arrayContaining([
        expect.objectContaining({
          user_asm: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
        }),
        expect.objectContaining({
          user_asm: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
        }),
      ]),
      error: { message: "" },
    });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Remove user", () => {
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

  test("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "767676789",
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
    server.close();
  });
});

describe("Remove user that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/record/remove-user/${JSON.stringify(paramsObj)}`
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

describe("Remove all users from a table", () => {
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
            user_asm: "767676789",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
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
    server.close();
  });
});

describe("Remove all users from a table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      tableName: "unknown_table",
    };

    const res = await request(server).delete(
      `/record/remove-all-users/${JSON.stringify(paramsObj)}`
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

describe("Update user props", () => {
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
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

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

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
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
    server.close();
  });
});

describe("Update user wrong props (case 1) (wrong prop name)", () => {
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
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          randomProp: "John",
          lastName: "Doe",
        },
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
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
    server.close();
  });
});

describe("Update user wrong props (case 2) (missing prop)", () => {
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
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          lastName: "Doe",
        },
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
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
    server.close();
  });
});

describe("Update user wrong props (case 3) (wrong prop order)", () => {
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
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "123456789",
          lastName: "Doe",
          firstName: "John",
        },
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
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
    server.close();
  });
});

describe("Update user wrong props (case 4) (wrong user_asm)", () => {
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
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456788",
        user: {
          user_asm: "123456789",
          lastName: "Doe",
          firstName: "John",
        },
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
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
    server.close();
  });
});

describe("Update user wrong props (case 5) (new user_asm belogs to other user)", () => {
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
            user_asm: "767676789",
            firstName: "Jane",
            lastName: "Danniel",
          },
        ],
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });

  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server)
      .post(`/record/update-user`)
      .send({
        tableName: "test_table_2024",
        userId: "123456789",
        user: {
          user_asm: "767676789",
          lastName: "Doe",
          firstName: "John",
        },
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: expect.any(String) },
    });
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
    server.close();
  });
});
