import fs from "fs/promises";

async function getAverageScreenshotSizeInDirectory(directoryPath: string) {
  try {
    // Get list of files and directories in the directory
    const entries = await fs.readdir(directoryPath);

    // Filter out only the files
    const filesSizes = entries.map(async (entry) => {
      const stats = await fs.stat(`${directoryPath}/${entry}`);

      if (stats.isFile()) {
        return stats.size;
      }

      return 0;
    });

    const result = await Promise.all(filesSizes);

    return result.reduce((x, y) => x + y) / entries.length;
  } catch (error) {
    return null;
  }
}

function getErrorCodeAndMessage(message: string) {
  let statusCode = 500;
  let messageReturned = "an unexpected error occurred";

  if (
    message === "SqliteError: no such table" ||
    message.includes("no such table") ||
    message === "table not found" ||
    message === "user not found" ||
    message === "screenshot not found"
  ) {
    statusCode = 404;

    if (message.includes("table")) {
      messageReturned = "table not found";
    } else if (message.includes("user")) {
      messageReturned = "user not found";
    } else {
      messageReturned = "user screenshot not found";
    }
  }

  if (message.includes("does not have the correct properties")) {
    statusCode = 400;
    messageReturned =
      "request object has wrong or missing or incorrectly ordered properties";
  }

  if (message.includes("already exists")) {
    statusCode = 409;

    if (message.includes("user id")) {
      messageReturned = "new user id already exists";
    } else if (message.includes("user")) {
      messageReturned = "one or more users already exist";
    } else if (message.includes("table")) {
      messageReturned = "table already exists";
    }
  }

  return { statusCode, messageReturned };
}

function getTime() {
  return new Date()
    .toISOString()
    .replace(".", "-")
    .replace(":", "-")
    .replace(":", "-");
}

async function errorLogger(
  errorObject: {
    method: string;
    url: string;
    body: any;
    params: string;
    errorName: string;
    error: string;
  },
  url: string,
  method: string
) {
  const time = getTime();
  await fs.writeFile(
    `./logs/${url}-${method}-${time}.txt`,
    JSON.stringify(errorObject, null, 2)
  );
}

export {
  getAverageScreenshotSizeInDirectory,
  getErrorCodeAndMessage,
  errorLogger,
};
