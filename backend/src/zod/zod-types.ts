import { z } from "zod";

const tableNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!.*_photos$)[a-zA-Z_][a-zA-Z0-9_]*$/);

const userPropNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!rec_id$)(?!photo_id$)[a-zA-Z_][a-zA-Z0-9_]*$/);

const userPropValueType = z.string().min(1).max(50);

const userType = z.record(userPropNameType, userPropValueType).refine(
  (user) => {
    const userKeys = Object.keys(user);

    return userKeys.length > 0 && userKeys.length < 11;
  },
  {
    message: "A user can have at least 1 and at most 10 keys",
  }
);

const usersType = z
  .array(userType)
  .min(1)
  .max(2_000)
  .refine(
    (users) => {
      if (users.length === 0) return false;
      if (users.length === 1) return true;

      const [firstUser, ...restUsers] = users;
      const firstUserKeys = Object.keys(firstUser);

      const equalityInKeys = restUsers.every((user) => {
        const keys = Object.keys(user);

        if (keys.length !== firstUserKeys.length) {
          return false;
        }

        const equalityInKeys = keys.every((key) => {
          return firstUserKeys.includes(key);
        });

        return equalityInKeys;
      });

      return equalityInKeys;
    },
    {
      message: "Users must have the same props",
    }
  );

const dayNumberType = z.string().min(1).max(10);

const screenshotType = z.object({
  type: z.literal("Buffer"),
  data: z.array(z.number()).min(100).max(100_000),
});

const columnNamesType = z
  .array(userPropNameType)
  .min(1)
  .max(10)
  .refine(
    (columnNames) => {
      const uniqueColumnNames = new Set(columnNames);

      return columnNames.length === uniqueColumnNames.size;
    },
    {
      message: "Column array must be an array of unique strings",
    }
  );

export {
  tableNameType,
  userType,
  usersType,
  userPropNameType,
  userPropValueType,
  dayNumberType,
  screenshotType,
  columnNamesType,
};
