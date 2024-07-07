import { z } from "zod";

const tableNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!.*_photos$)[a-zA-Z_][a-zA-Z0-9_]*$/);

const userType = z
  .record(
    z
      .string()
      .min(5)
      .max(20)
      .regex(/^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/),
    z.string().min(1).max(50)
  )
  .refine(
    (user) => {
      const keys = Object.keys(user);

      return keys.length > 0 && keys.length < 11;
    },
    {
      message: "A user can have at least 1 and at most 10 keys",
    }
  );

const usersType = z
  .array(
    z
      .record(
        z
          .string()
          .min(5)
          .max(20)
          .regex(
            /^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/
          ),
        z.string().min(1).max(50)
      )
      .refine(
        (user) => {
          const keys = Object.keys(user);

          return keys.length > 0 && keys.length < 11;
        },
        {
          message: "A user must have at least 1 and at most 10 keys",
        }
      )
      .refine(
        (user) => {
          const keys = Object.keys(user);
          return keys.length === new Set(keys).size;
        },
        {
          message: "A user must have unique props",
        }
      )
  )
  .min(1)
  .max(2_000)
  .refine(
    (users) => {
      if (users.length === 0) return false;

      const keys = Object.keys(users[0]);
      const [firstKey] = keys;
      return users.length === new Set(users.map((user) => user[firstKey])).size;
    },
    {
      message: "Users cannot have duplicate keys",
    }
  )
  .refine(
    (users) => {
      if (users.length === 0) return false;

      const set = new Set();
      const keys = Object.keys(users[0]);
      keys.forEach((key) => {
        set.add(key);
      });

      users.forEach((user) => {
        Object.keys(user).forEach((key) => {
          set.add(key);
        });
      });

      return set.size === keys.length;
    },
    {
      message: "Users must have the same props",
    }
  );

const userIdNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/);

const userIdType = z.string().min(1).max(50);

const dayNumberType = z.string().min(1).max(10);

const screenshotType = z.object({
  type: z.literal("Buffer"),
  data: z.array(z.number()).max(100_000),
});

const columnNamesType = z
  .array(
    z
      .string()
      .min(5)
      .max(20)
      .regex(/^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/)
  )
  .min(1)
  .max(10)
  .refine(
    (columnNames) => {
      return columnNames.length === new Set(columnNames).size;
    },
    {
      message: "Column array must be an array of unique strings",
    }
  );

export {
  tableNameType,
  userType,
  usersType,
  userIdNameType,
  userIdType,
  dayNumberType,
  screenshotType,
  columnNamesType,
};
