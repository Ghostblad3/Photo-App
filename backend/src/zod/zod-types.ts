import { z } from "zod";

const tableNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!.*_photos$)[a-zA-Z_][a-zA-Z0-9_]*$/);

const userType = z.record(
  z
    .string()
    .min(1)
    .max(10)
    .regex(/^(?!rec_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/),
  z.string().min(1).max(50)
);

const usersType = z
  .array(
    z.record(
      z
        .string()
        .min(1)
        .max(10)
        .regex(/^(?!rec_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/),
      z.string().min(1).max(50)
    )
  )
  .min(1)
  .max(10_000);

const userIdNameType = z
  .string()
  .min(5)
  .max(20)
  .regex(/^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/);

const userIdType = z.string().min(1).max(50);

const dayNumberType = z.string().min(1).max(10);

const screenshotType = z.object({
  type: z.literal("Buffer"),
  data: z.array(z.number()),
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
  .max(20)
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
