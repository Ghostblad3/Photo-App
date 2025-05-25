import request from "supertest";
import fs from "fs";
import { app } from "../server";
import { resetInMemoryDb } from "../db-connection/connection";
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
    const res = await request(app).get("/screenshot/random-route");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "route not found" });
  });
});

describe("Add user screenshot", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return success", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(app)
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
      data: {
        photo_timestamp: expect.stringMatching(
          /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?[+-][0-2]\d:[0-5]\dZ?)?)?)?/,
        ),
      },
      error: { message: "" },
    });
  });
});

describe("Add user screenshot with wrong user prop id name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(app)
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
});

describe("Add user screenshot to wrong table", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(app)
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
});

describe("Add user screenshot with wrong user id", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(app)
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
});

describe("Update user screenshot date", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return success", async () => {
    const res = await request(app)
      .patch("/screenshot/update-user-screenshot-date")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: "1",
        tableName: "test_table_2024",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Update user screenshot date with wrong user id prop name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch("/screenshot/update-user-screenshot-date")
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
});

describe("Update user screenshot date with wrong user id", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch("/screenshot/update-user-screenshot-date")
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
});

describe("Update user screenshot date using wrong table name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return error", async () => {
    const res = await request(app)
      .patch("/screenshot/update-user-screenshot-date")
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
});

describe("Delete user screenshot", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      "/screenshot/delete-user-screenshot/userIdName/user_asm/userId/123456789/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: {},
      error: { message: "" },
    });
  });
});

describe("Delete user screenshot for user that doesn't have screenshot", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      "/screenshot/delete-user-screenshot/userIdName/user_asm/userId/123456789/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user screenshot not found" },
    });
  });
});

describe("Delete user screenshot with wrong user id name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "asmasm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      "/screenshot/delete-user-screenshot/userIdName/asmasm/userId/123456789/tableName/test_table_2024",
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

describe("Delete user screenshot with wrong user id", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_table_2024",
    };

    const res = await request(app).delete(
      "/screenshot/delete-user-screenshot/userIdName/user_asm/userId/999999999/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });
});

describe("Delete user screenshot with wrong table name", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_2024",
    };

    const res = await request(app).delete(
      "/screenshot/delete-user-screenshot/userIdName/user_asm/userId/999999999/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Retrieve all user screenshots for specific day", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return success", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshots-single-day/dayNumber/1/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [
        {
          photo_id: 1,
          dayNumber: "1",
          photo_timestamp: "2024-06-22T05:28:44.596Z",
          rec_id: 1,
          user_asm: "123456789",
          firstName: "peter",
          lastName: "johnson",
          screenshot:
            "iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAIAAADpZ+PpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVChTY2DY8BMH+j1y5Tb8BgBuMZV/pMayZwAAAABJRU5ErkJggg==",
        },
      ],
      error: { message: "" },
    });
  });
});

describe("Retrieve all user screenshots for specific day that doesn't exist", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
  });

  it("Should return success", async () => {
    const paramsObj = {
      dayNumber: "9",
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshots-single-day/dayNumber/9/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [],
      error: { message: "" },
    });
  });
});

describe("Retrieve all user screenshots for specific day from table that doesn't exist", () => {
  it("Should return error", async () => {
    const paramsObj = {
      dayNumber: "1",
      tableName: "test_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshots-single-day/dayNumber/1/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Retrieve all submitted days for user screenshots", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-submitted-days/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: ["1"],
      error: { message: "" },
    });
  });
});

describe("Retrieve all submitted days for user screenshots when there aren't submitted screenshots", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
  });

  it("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-submitted-days/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [],
      error: { message: "" },
    });
  });
});

describe("Retrieve all submitted days for user screenshots for table that doesn't exist", () => {
  it("Should return error", async () => {
    const paramsObj = {
      tableName: "test_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-submitted-days/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Retrieve user screenshot", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return success", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshot/userIdName/user_asm/userId/123456789/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: expect.any(String),
      error: { message: "" },
    });
  });
});

describe("Retrieve user screenshot for user id prop name that doesn't exist", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "asmasm",
      userId: "123456789",
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshot/userIdName/asmasm/userId/123456789/tableName/test_table_2024",
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

describe("Retrieve user screenshot for user id that doesn't exist", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "999999999",
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshot/userIdName/user_asm/userId/999999999/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "user not found" },
    });
  });
});

describe("Retrieve user screenshot for table that doesn't exist", () => {
  it("Should return error", async () => {
    const paramsObj = {
      userIdName: "user_asm",
      userId: "123456789",
      tableName: "test_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshot/userIdName/user_asm/userId/123456789/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Retrieve user data for users that have screenshot", () => {
  beforeEach(() => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
  });

  it("Should return success", async () => {
    const res = await request(app).get(
      "/screenshot/retrieve-user-data-with-screenshots/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [
        {
          dayNumber: "1",
          photo_timestamp: "2024-06-22T05:28:44.596Z",
          user_asm: "123456789",
          firstName: "peter",
          lastName: "johnson",
        },
      ],
      error: { message: "" },
    });
  });
});

describe("Retrieve user data for users that have screenshot for table that doesn't exist", () => {
  it("Should return error", async () => {
    const res = await request(app).get(
      "/screenshot/retrieve-user-data-with-screenshots/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});

describe("Retrieve user screenshots for all days", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return success", async () => {
    const paramsObj = {
      tableName: "test_table_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshots-all-days/tableName/test_table_2024",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      data: [
        {
          user_asm: "123456789",
          firstName: "peter",
          lastName: "johnson",
          dayNumber: "1",
          photo_timestamp: "2024-06-22T05:28:44.596Z",
          screenshot:
            "iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAIAAADpZ+PpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVChTY2DY8BMH+j1y5Tb8BgBuMZV/pMayZwAAAABJRU5ErkJggg==",
        },
      ],
      error: { message: "" },
    });
  });
});

describe("Retrieve user screenshots for all days for table that doesn't exist", () => {
  beforeEach(async () => {
    createUserTable();
    createPhotoTable();
    insertUser();
    insertPhoto();
    await movePhotoToFolder();
  });

  it("Should return error", async () => {
    const paramsObj = {
      tableName: "test_2024",
    };

    const res = await request(app).get(
      "/screenshot/retrieve-user-screenshots-all-days/tableName/test_2024",
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      status: "error",
      data: {},
      error: { message: "table not found" },
    });
  });
});
