import {
  tableNameType,
  userType,
  usersType,
  userPropNameType,
  userPropValueType,
  dayNumberType,
  screenshotType,
  columnNamesType,
} from "../zod/zod-types";

describe("tableName Zod schema", () => {
  it("case 1 - valid string - valid min length", () => {
    expect(tableNameType.safeParse("a".repeat(5)).success).toBe(true);
  });

  it("case 2 - valid string - valid max length", () => {
    expect(tableNameType.safeParse("a".repeat(20)).success).toBe(true);
  });

  it("case 3 - valid string - valid name", () => {
    expect(tableNameType.safeParse("some_name123").success).toBe(true);
  });

  it("case 4 - valid string - can start with underscore", () => {
    expect(tableNameType.safeParse("_some").success).toBe(true);
  });

  it("case 5 - invalid string - can not start with number", () => {
    expect(tableNameType.safeParse("1some").success).toBe(false);
  });

  it("case 6 - invalid string - length too short", () => {
    expect(tableNameType.safeParse("a".repeat(4)).success).toBe(false);
  });

  it("case 7 - invalid string - length too long", () => {
    expect(tableNameType.safeParse("a".repeat(21)).success).toBe(false);
  });

  it("case 8 - invalid string - disallowed ending string _photos", () => {
    expect(tableNameType.safeParse("my_photos").success).toBe(false);
  });

  it("case 9 - valid string - can contain my_photos string anywhere except the end", () => {
    expect(tableNameType.safeParse("my_photosa").success).toBe(true);
  });

  it("case 10 - valid string - can contain my_photos string anywhere except the end", () => {
    expect(tableNameType.safeParse("amy_photosa").success).toBe(true);
  });

  it("case 11 - invalid string - disallowed symbol *", () => {
    expect(tableNameType.safeParse("some*name").success).toBe(false);
  });

  it("case 12 - invalid string - invalid type", () => {
    expect(tableNameType.safeParse(888787).success).toBe(false);
  });
});

describe("userIdNameType Zod schema", () => {
  it("case 1 - valid string", () => {
    expect(userPropNameType.safeParse("user_name123").success).toBe(true);
  });

  it("case 2 - valid string, can start with underscore", () => {
    expect(userPropNameType.safeParse("_valid123").success).toBe(true);
  });

  it("case 3 - valid string - valid min length", () => {
    expect(userPropNameType.safeParse("a".repeat(5)).success).toBe(true);
  });

  it("case 4 - valid string - valid max length", () => {
    expect(userPropNameType.safeParse("a".repeat(20)).success).toBe(true);
  });

  it("case 5 - invalid string - length too short", () => {
    expect(userPropNameType.safeParse("a".repeat(4)).success).toBe(false);
  });

  it("case 6 - invalid string - length too long", () => {
    expect(userPropNameType.safeParse("a".repeat(21)).success).toBe(false);
  });

  it("case 7 - invalid string - disallowed identifier rec_id", () => {
    expect(userPropNameType.safeParse("rec_id").success).toBe(false);
  });

  it("case 8 - invalid string - disallowed identifier photo_id", () => {
    expect(userPropNameType.safeParse("photo_id").success).toBe(false);
  });

  it("case 9 - valid string - can contain rec_id", () => {
    expect(userPropNameType.safeParse("rec_id1").success).toBe(true);
  });

  it("case 10 - valid string - can contain photo_id", () => {
    expect(userPropNameType.safeParse("photo_id1").success).toBe(true);
  });

  it("case 11 - invalid string - starts with number", () => {
    expect(userPropNameType.safeParse("1invalid").success).toBe(false);
  });

  it("case 12 - invalid string - contains symbol *", () => {
    expect(userPropNameType.safeParse("invalid*name").success).toBe(false);
  });

  it("case 13 - invalid string - invalid type", () => {
    expect(userPropNameType.safeParse(78787).success).toBe(false);
  });
});

describe("userPropValueType Zod schema", () => {
  it("case 1 - valid string - valid min length", () => {
    expect(userPropValueType.safeParse("a").success).toBe(true);
  });

  it("case 2 - valid string - valid max length", () => {
    expect(userPropValueType.safeParse("a".repeat(50)).success).toBe(true);
  });

  it("case 4 - valid string - all characters are acceptable", () => {
    expect(userPropValueType.safeParse("$a1dEW di!").success).toBe(true);
  });

  it("case 5 - invalid string - length too short", () => {
    expect(userPropValueType.safeParse("").success).toBe(false);
  });

  it("case 6 - invalid string - length too long", () => {
    expect(userPropValueType.safeParse("a".repeat(51)).success).toBe(false);
  });

  it("case 7 - invalid string - invalid type", () => {
    expect(userPropValueType.safeParse(97678).success).toBe(false);
  });
});

describe("dayNumberType Zod schema", () => {
  it("case 1 - valid string - valid min length", () => {
    expect(dayNumberType.safeParse("a").success).toBe(true);
  });

  it("case 2 - valid string - valid max length", () => {
    expect(dayNumberType.safeParse("a".repeat(10)).success).toBe(true);
  });

  it("case 3 - valid string - can contain any character", () => {
    expect(dayNumberType.safeParse("$a1d6EW i!").success).toBe(true);
  });

  it("case 4 - invalid string - invalid min length", () => {
    expect(dayNumberType.safeParse("").success).toBe(false);
  });

  it("case 5 - invalid string - invalid max length", () => {
    expect(dayNumberType.safeParse("a".repeat(11)).success).toBe(false);
  });

  it("case 6 - invalid string - invalid type", () => {
    expect(dayNumberType.safeParse(43453).success).toBe(false);
  });
});

describe("screenshotType Zod schema", () => {
  it("case 1 - valid object - data valid min length", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: Array(100).fill(0),
      }).success
    ).toBe(true);
  });

  it("case 2 - valid object - data valid max length", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: Array(50_000).fill(0),
      }).success
    ).toBe(true);
  });

  it("case 3 - invalid object - data invalid min length", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: Array(99).fill(0),
      }).success
    ).toBe(false);
  });

  it("case 4 - invalid object - data invalid max length", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: Array(100_001).fill(0),
      }).success
    ).toBe(false);
  });

  it("case 5 - invalid object - invalid type property value", () => {
    expect(
      screenshotType.safeParse({
        type: "Image", // Invalid type, must be "Buffer"
        data: [1, 2, 3],
      }).success
    ).toBe(false);
  });

  it("case 6 - invalid object - invalid data max length", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: Array(100_001).fill(0), // Array of 100,001 numbers (too long)
      }).success
    ).toBe(false);
  });

  it("case 7 - invalid object - invalid data value", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: [1, 2, "three", 4], // Contains a non-number
      }).success
    ).toBe(false);
  });

  it("case 8 - invalid object - invalid data value", () => {
    expect(
      screenshotType.safeParse({
        type: "Buffer",
        data: 12345, // Should be an array, not a number
      }).success
    ).toBe(false);
  });
});

describe("columnNamesType Zod schema", () => {
  it("case 1 - valid array - valid min length", () => {
    expect(columnNamesType.safeParse(["some_column_name"]).success).toBe(true);
  });

  it("case 2 - valid array - valid max length", () => {
    expect(
      columnNamesType.safeParse([
        "some_column_nameA",
        "some_column_nameB",
        "some_column_nameC",
        "some_column_nameD",
        "some_column_nameE",
        "some_column_nameF",
        "some_column_nameG",
        "some_column_nameH",
        "some_column_nameI",
        "some_column_nameJ",
      ]).success
    ).toBe(true);
  });

  it("case 3 - invalid array - invalid min length", () => {
    expect(columnNamesType.safeParse([]).success).toBe(false);
  });

  it("case 4 - invalid array - invalid max length", () => {
    expect(
      columnNamesType.safeParse([
        "some_column_nameA",
        "some_column_nameB",
        "some_column_nameC",
        "some_column_nameD",
        "some_column_nameE",
        "some_column_nameF",
        "some_column_nameG",
        "some_column_nameH",
        "some_column_nameI",
        "some_column_nameJ",
        "some_column_nameK",
      ]).success
    ).toBe(false);
  });

  it("case 5 - invalid array - invalid type", () => {
    expect(columnNamesType.safeParse("some_column_name").success).toBe(false);
  });

  it("case 6 - invalid array - invalid array type", () => {
    expect(columnNamesType.safeParse([1, 2, 3]).success).toBe(false);
  });

  it("case 7 - invalid array - duplicate values", () => {
    expect(
      columnNamesType.safeParse([
        "some_column_nameA",
        "some_column_nameA",
        "some_column_nameC",
      ]).success
    ).toBe(false);
  });
});

describe("userType Zod schema", () => {
  it("case 1 - valid object", () => {
    expect(
      userType.safeParse({
        some_prop: "aaaaa",
        some_prop2: "aaaaa",
      }).success
    ).toBe(true);
  });

  it("case 2 - valid object - valid min prop number", () => {
    expect(
      userType.safeParse({
        some_prop: "aaaaa",
      }).success
    ).toBe(true);
  });

  it("case 3 - valid object - valid max prop number", () => {
    expect(
      userType.safeParse({
        someprop1: "aaaaa",
        someprop2: "aaaaa",
        someprop3: "aaaaa",
        someprop4: "aaaaa",
        someprop5: "aaaaa",
        someprop6: "aaaaa",
        someprop7: "aaaaa",
        someprop8: "aaaaa",
        someprop9: "aaaaa",
        someprop10: "aaaaa",
      }).success
    ).toBe(true);
  });

  it("case 4 - invalid object - too few props", () => {
    expect(userType.safeParse({}).success).toBe(false);
  });

  it("case 5 - invalid object - too many props", () => {
    expect(
      userType.safeParse({
        someprop1: "aaaaa",
        someprop2: "aaaaa",
        someprop3: "aaaaa",
        someprop4: "aaaaa",
        someprop5: "aaaaa",
        someprop6: "aaaaa",
        someprop7: "aaaaa",
        someprop8: "aaaaa",
        someprop9: "aaaaa",
        someprop10: "aaaaa",
        someprop11: "aaaaa",
      }).success
    ).toBe(false);
  });
});

describe("usersType Zod schema", () => {
  it("case 1 - valid array of objects", () => {
    expect(
      usersType.safeParse([
        {
          some_prop: "123459",
          some_prop2: "aaaaa",
        },
        {
          some_prop: "123459",
          some_prop2: "aaaaa",
        },
      ]).success
    ).toBe(true);
  });

  it("case 2 - invalid array of objects - objects with different props", () => {
    expect(
      usersType.safeParse([
        {
          some_prop: "123459",
          some_prop2: "aaaaa",
        },
        {
          some_prop: "123459",
          some_prop3: "aaaaa",
        },
      ]).success
    ).toBe(false);
  });

  it("case 3 - invalid array of objects - objects with different number of props", () => {
    expect(
      usersType.safeParse([
        {
          some_prop: "123459",
        },
        {
          some_prop: "123459",
          some_prop3: "aaaaa",
        },
      ]).success
    ).toBe(false);
  });

  it("case 4 - invalid array of objects - too few objects", () => {
    expect(usersType.safeParse([]).success).toBe(false);
  });

  it("case 5 - invalid array of objects - too many objects", () => {
    const users = [];

    for (let i = 0; i < 2001; i++) {
      users.push({
        some_prop: "123459",
        some_prop2: "aaaaa",
      });
    }

    expect(usersType.safeParse(users).success).toBe(false);
  });

  it("case 6 - valid array of objects - valid array min length", () => {
    expect(
      usersType.safeParse([
        {
          some_prop: "123459",
          some_prop2: "aaaaa",
        },
      ]).success
    ).toBe(true);
  });

  it("case 7 - valid array of objects - valid array max length", () => {
    const users = [];

    for (let i = 0; i < 2000; i++) {
      users.push({
        some_prop: "123459",
        some_prop2: "aaaaa",
      });
    }

    expect(usersType.safeParse(users).success).toBe(true);
  });
});
