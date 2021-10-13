const fs = require("fs-extra");
const path = require("path");
const squirrelly = require("squirrelly");
const {
  createFile,
  createFolderIfMissing,
  fileExists,
  listFiles,
  createSymLink,
} = require("./lib/fs");
const execa = require("execa");
const { compile } = require("./lib/webpack");

const frontDir = path.resolve(__dirname, "..", "front");
const srcDir = path.resolve(__dirname, "..", "src");

const srcDirs = [
  path.resolve(srcDir, "lib1"),
  path.resolve(srcDir, "lib2"),
  path.resolve(srcDir, "src"),
];

// Get package.json file as string
async function getPackageJSON(config) {
  const packageJSON = await fs.readFile(
    path.resolve(__dirname, "src", "packageJSON.json")
  );
  return squirrelly.render(packageJSON.toString(), config);
}

// Create the package.json file if missing
async function createMissingPackageJSON(dir, config) {
  if (!(await fileExists(dir))) {
    const packageJSON = await getPackageJSON(config);
    await createFile(dir, packageJSON);
    return true;
  }
  return false;
}

// Intall front monorepo dependencies
function installDeps(dir) {
  return new Promise((resolve, reject) => {
    const { stdout, stderr } = execa.command(`yarn --cwd ${dir}`);

    stderr.on("data", (e) => {
      const message = e.toString();
      if (message.startsWith("warning")) {
        console.log(message);
      } else {
        reject(new Error(message));
      }
    });

    stdout.pipe(process.stdout);

    stdout.on("end", () => {
      resolve();
    });
  });
}

// Save the current src files as symlinks in frontdir
async function linkSourceCode() {
  const existingFiles = await listFiles(frontDir, true);
  await Promise.all(
    srcDirs.map((dir) => {
      const fileName = path.basename(dir);
      if (!existingFiles.get(fileName)) {
        return createSymLink(dir, path.resolve(frontDir, fileName));
      }
    })
  );
}

async function main() {
  await createFolderIfMissing(frontDir);
  await createMissingPackageJSON(path.resolve(frontDir, "package.json"), {
    name: "leemons-front",
    version: "1.0.0",
  });

  await linkSourceCode();
  await installDeps(frontDir);

  const build = await compile();

  try {
    await build();
    console.log("Built");
  } catch (e) {
    console.error(e);
  }

  return frontDir;
}

main();
