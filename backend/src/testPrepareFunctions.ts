import sqlite from "./database/connection";
import fs from "fs/promises";

function createUserTable(tableName: string = "test_table_2024") {
  sqlite
    .prepare(
      `create table if not exists ${tableName} (
      rec_id integer not null,
      user_asm text not null unique,
      firstName text not null,
      lastName text not null,
      primary key("rec_id"))`
    )
    .run();
}

function createPhotoTable(tableName: string = "test_table_2024") {
  sqlite
    .prepare(
      `create table if not exists ${tableName}_photos (
      photo_id integer not null,
      dayNumber text not null,
      path text not null unique,
      photo_timestamp text not null,
      rec_id integer not null unique,
      primary key("photo_id"),
      foreign key("rec_id") references ${tableName}("rec_id") on delete cascade);`
    )
    .run();
}

function insertUser(
  tableName: string = "test_table_2024",
  user_asm: string = "123456789",
  firstName: string = "peter",
  lastName: string = "johnson"
) {
  sqlite
    .prepare(
      `insert into ${tableName} (user_asm, firstName, lastName) 
      values (?, ?, ?)`
    )
    .run(user_asm, firstName, lastName);
}

function insertPhoto(
  tableName: string = "test_table_2024",
  dayNumber: string = "1",
  path: string = "./screenshots/test_table_2024/1.png",
  photo_timestamp: string = "2024-06-22T05:28:44.596Z",
  rec_id: number = 1
) {
  sqlite
    .prepare(
      `insert into ${tableName}_photos (dayNumber, path, photo_timestamp, rec_id) 
      values (?, ?, ?, ?)`
    )
    .run(dayNumber, path, photo_timestamp, rec_id);
}

async function movePhotoToFolder(
  tableName: string = "test_table_2024",
  path: string = "./screenshots",
  photoLocation: string = "./src/dummy_photo/1.png"
) {
  try {
    await fs.access(`${path}/${tableName}`);
  } catch (ex) {
    await fs.mkdir(`${path}/${tableName}`);
  }

  await fs.copyFile(photoLocation, `${path}/${tableName}/1.png`);
}

async function deletePhotoFromFolder(tableName: string = "test_table_2024") {
  try {
    await fs.access(`./screenshots/${tableName}`);
    await fs.rm(`./screenshots/${tableName}`, { recursive: true, force: true });
  } catch (e) {}
}

function deleteUser(
  tableName: string = "test_table_2024",
  user_asm: string = "123456789"
) {
  sqlite.prepare(`delete from ${tableName} where user_asm = ?`).run(user_asm);
}

function dropTables(tableNames: string[] = ["test_table_2024"]) {
  tableNames.forEach((tableName) => {
    sqlite.prepare(`drop table if exists ${tableName}`).run();
  });
}

export {
  createUserTable,
  createPhotoTable,
  insertUser,
  insertPhoto,
  movePhotoToFolder,
  deleteUser,
  dropTables,
  deletePhotoFromFolder,
};
