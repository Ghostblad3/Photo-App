import fs from "fs/promises";

export default async function getFilesInDirectorySync(directoryPath: string) {
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

    return result.reduce((x, y) => x + y);
  } catch (error) {
    return null;
  }
}
