import request from "supertest";
import fs from "fs";
import { server } from "../server";
import {
  createUserTable,
  createPhotoTable,
  insertUser,
  insertPhoto,
  movePhotoToFolder,
  deleteUser,
  dropTables,
  deletePhotoFromFolder,
} from "../testPrepareFunctions";

jest.setTimeout(30000);

describe("Call an api route that doesn't exist", () => {
  test("should return error", async () => {
    const res = await request(server).get("/screenshot/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });

  afterAll(() => {
    server.close();
  });
});

describe("Add user screenshot", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return success", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(server)
      .post("/screenshot/add-user-screenshot")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_table_2024",
        screenshot: screenshot,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      status: "success",
      data: {},
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

describe("Add user screenshot with wrong user prop id name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(server)
      .post("/screenshot/add-user-screenshot")
      .send({
        userIdName: "asmasmasm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_table_2024",
        screenshot: screenshot,
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

  afterAll(async () => {
    deleteUser();
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Add user screenshot to wrong table", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(server)
      .post("/screenshot/add-user-screenshot")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_2024",
        screenshot: screenshot,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(async () => {
    deleteUser();
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Add user screenshot with wrong user id", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(server)
      .post("/screenshot/add-user-screenshot")
      .send({
        userIdName: "user_asm",
        userId: "999999999",
        dayNumber: "1",
        tableName: "test_table_2024",
        screenshot: screenshot,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });

  afterAll(async () => {
    deleteUser();
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Update user screenshot date", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return success", async () => {
    const res = await request(server)
      .post("/screenshot/update-user-screenshot-date")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_table_2024",
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

describe("Update user screenshot date with wrong user id prop name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/screenshot/update-user-screenshot-date")
      .send({
        userIdName: "asmasm",
        userId: "123456789",
        dayNumber: "1",
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
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Update user screenshot date with wrong user id", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/screenshot/update-user-screenshot-date")
      .send({
        userIdName: "user_asm",
        userId: "99999999",
        dayNumber: "1",
        tableName: "test_table_2024",
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

describe("Update user screenshot date using wrong table name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return error", async () => {
    const res = await request(server)
      .post("/screenshot/update-user-screenshot-date")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_2024",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Delete user screenshot", () => {
  beforeAll(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
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
      `/screenshot/delete-user-screenshot/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
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

describe("Delete user screenshot for user that doesn't have screenshot", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/screenshot/delete-user-screenshot/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user screenshot not found" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Delete user screenshot with wrong user id name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "asmasm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/screenshot/delete-user-screenshot/${JSON.stringify(paramsObj)}`
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
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Delete user screenshot with wrong user id", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_table_2024",
    };

    const res = await request(server).delete(
      `/screenshot/delete-user-screenshot/${JSON.stringify(paramsObj)}`
    );

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

describe("Delete user screenshot with wrong table name", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_2024",
    };

    const res = await request(server).delete(
      `/screenshot/delete-user-screenshot/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Retrieve all user screenshots for specific day", () => {
  beforeAll(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  test("Should return success", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshots-single-day/${JSON.stringify(
        paramsObj
      )}`
    );

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

      expect(item).toMatchObject({
        photo_id: expect.any(Number),
        rec_id: expect.any(Number),
        screenshot: expect.any(String),
        photo_timestamp: expect.any(String),
        dayNumber: expect.any(String),
      });

      const keysFiltered = keys.filter(
        (key) =>
          key !== "photo_id" &&
          key !== "rec_id" &&
          key !== "dayNumber" &&
          key !== "screenshot" &&
          key !== "photo_timestamp"
      );

      keysFiltered.forEach((key) => expect(typeof item[key]).toBe("string"));
    });
  });

  afterAll(async () => {
    deleteUser();
    dropTables();
    await deletePhotoFromFolder();

    server.close();
  });
});

describe("Retrieve all user screenshots for specific day that doesn't exist", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
  });

  test("Should return success", async () => {
    const paramsObj = {
      dayNumber: "9",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshots-single-day/${JSON.stringify(
        paramsObj
      )}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [],
      error: { message: "" },
    });
  });

  afterAll(() => {
    dropTables();

    server.close();
  });
});

describe("Retrieve all user screenshots for specific day from table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshots-single-day/${JSON.stringify(
        paramsObj
      )}`
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

describe("Retrieve all submitted days for user screenshots", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return success", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-submitted-days/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual({
      status: "success",
      data: expect.any(Array),
      error: { message: "" },
    });

    const { data } = res.body;

    data.forEach((item: unknown) => {
      expect(typeof item).toBe("string");
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Retrieve all submitted days for user screenshots when there aren't submitted screenshots", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  test("Should return success", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-submitted-days/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [],
      error: { message: "" },
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Retrieve all submitted days for user screenshots for table that doesn't exist", () => {
  beforeAll(() => {});

  test("Should return error", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-submitted-days/${JSON.stringify(paramsObj)}`
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

describe("Retrieve user screenshot", () => {
  beforeAll(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  test("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshot/${JSON.stringify(paramsObj)}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(String),
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

describe("Retrieve user screenshot for user id prop name that doesn't exist", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "asmasm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshot/${JSON.stringify(paramsObj)}`
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
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Retrieve user screenshot for user id that doesn't exist", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshot/${JSON.stringify(paramsObj)}`
    );

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

describe("Retrieve user screenshot for table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-screenshot/${JSON.stringify(paramsObj)}`
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

describe("Retrieve user data for users that have screenshot", () => {
  beforeAll(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  test("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-data-with-screenshots/${JSON.stringify(
        paramsObj
      )}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(Array),
      error: { message: "" },
    });

    const { data } = res.body;

    data.forEach((item: unknown) => {
      expect(typeof item).toBe("object");

      const keys = Object.keys(item!);

      keys.forEach((prop: unknown) => {
        expect(typeof prop).toBe("string");
      });
    });
  });

  afterAll(() => {
    deleteUser();
    dropTables();

    server.close();
  });
});

describe("Retrieve user data for users that have screenshot for table that doesn't exist", () => {
  test("Should return error", async () => {
    const paramsObj = {
      tableName: "test_2024",
    };

    const res = await request(server).get(
      `/screenshot/retrieve-user-data-with-screenshots/${JSON.stringify(
        paramsObj
      )}`
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

// describe("Retrieve user screenshots for all days", () => {
//   beforeAll(async () => {
//     createUserTable();
//     createPhotoTable();
//     insertUser();
//     insertPhoto();
//     await movePhotoToFolder();
//   });

//   test("Should return success", async () => {
//     const paramsObj = {
//       tableName: "test_table_2024",
//     };

//     const res = await request(server).get(
//       `screenshot/retrieve-user-screenshots-all-days/${JSON.stringify(
//         paramsObj
//       )}`
//     );

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toEqual({
//       status: "success",
//       data: expect.any(Array),
//       error: { message: "" },
//     });
//   });

//   afterAll(async () => {
//     deleteUser();
//     dropTables();
//     await deletePhotoFromFolder();

//     server.close();
//   });
// });