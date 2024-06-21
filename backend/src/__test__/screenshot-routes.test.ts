import request from "supertest";
import fs from "fs";
import server from "../server";

describe("Add user screenshot", () => {
  test("Should return success", async () => {
    const res = await request(server)
      .post("/record/add-users")
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
    const screenshot = fs.readFileSync("./src/dummy_data/images/1.png");

    const res = await request(server)
      .post("/screenshot/add-user-screenshot")
      .send({
        userIdName: "user_asm",
        userId: "123456789",
        dayNumber: screenshot.length.toString(),
        tableName: "test_table_2024",
        screenshot: screenshot,
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

describe("Delete user screenshot", () => {
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
