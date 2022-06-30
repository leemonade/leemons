const { createGzip } = require('zlib');
const fs = require('fs-extra');
const path = require('path');

module.exports = ({ id, folder, filename: basename }) => {
  const handler = async (resolve, reject) => {
    // Compose the path
    const filename = path.resolve(folder, basename);
    // If a log exists check if has the same logger id or gzip it
    if (await fs.exists(filename)) {
      const file = fs
        // Read file inside a stream (infinite file size)
        .createReadStream(filename)

        // When an error occurs reading the file reject
        .on('error', () => {
          reject(new Error(`Log file ${filename} can not be read`));
        })

        // When finished GZIPing continue the execution
        .on('end', async () => {
          await fs.remove(filename);
          await fs.writeFile(filename, `${id}\n`);
          resolve({ id, filename, isNew: true });
        })

        // When ready to read, get the id from file
        .once('readable', async () => {
          // If the ids match, stop file manipulation and continue
          const content = file.read(37);

          if (content && content.toString().trim() === id) {
            resolve({ id, filename, isNew: false });
          } else {
            // Get the filename for the gzipped log
            const newName = path.resolve(
              folder,
              `${(await fs.lstat(filename)).birthtime.toISOString()}.log.gz`
            );

            // Gzipper function
            const gzipper = createGzip().on('error', () => {
              reject(new Error(`The latest log can not be gzipped`));
            });

            // Gzipped file stream
            const gzippedFile = fs.createWriteStream(newName).on('error', () => {
              reject(new Error(`The gzipped log file can not be created`));
            });

            // GZIP the file and save it
            file.pipe(gzipper).pipe(gzippedFile);
          }
        });
    } else {
      // If the file does not exists

      // Create the log directory if needed
      if (!(await fs.pathExists(folder))) {
        await fs.mkdirp(folder);
      }
      // Save the id to the log file
      await fs.writeFile(filename, `${id}\n`);

      resolve({ id, filename, isNew: true });
    }
  };

  return new Promise(handler);
};
