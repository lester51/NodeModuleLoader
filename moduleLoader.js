const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { execSync, exec } = require("child_process");
const isValidNPM = require("npm-exists");
const strip = require("strip-comments");
const { globPromise } = require("file-path-helper");
const progress = require("smooth-progress");

var parent = module.parent;
var parentFile = parent.filename;
var parentDir = path.dirname(parentFile);
delete require.cache[__filename];

let requireChecker = async (dir) => {
  return new Promise((res, rej) => {
    fs.readFile(dir, "utf8", async function (err, data) {
      let code = strip(data)
        .match(/require\((.*?)\)/g)
        .join()
        .match(/((\"(.*?)\")|(\'(.*?)\')|(\`(.*?)\`))/g)
        .join()
        .replace(/[\"\'\`]/g, "")
        .split(",");
      let boolArr = []; //,errRequire = []
      for (let i = 0; i < code.length; ++i) {
        let isNPM = await isValidNPM(code[i]).then((isNPM) => isNPM);
        //let isNPMInstalled = await globPromise('node_modules/'+code[i]).then(filePathList => (filePathList.length!==0) ? true : false)
        let isLocal = await globPromise(
          code[i].split("/").splice(-2).join("/"),
        ).then((filePathList) => (filePathList.length !== 0 ? true : false));
        if (isNPM) {
          await new Promise((resolve, reject) => {
            exec(`node ${dir}`, (error, stdout, stderr) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(stdout);
            });
          }).catch((err) => {
            const match = String(err).match(/Cannot find module '(.*)'/);
            if (match && !match[1].startsWith(".")) {
              let nodeScripts = eval(
                `let a=()=>{arr=${
                  err
                    .toString()
                    .match(/requireStack: \[(.*?)\]/g)[0]
                    .match(/\[(.*?)\]/g)[0]
                };return arr;};a();`,
              )
                .map((e) => `node ${e} &&`)
                .join(" ")
                .split("&&")
                .filter((e) => e !== "")
                .join("&&");
              let install = execSync(
                `npm i ${match[1]} --save --non-interactive --no-bin-links --ignore-engines --skip-integrity-check`,
                { stdio: "inherit", encoding: "utf8" },
              );
              exec(`${nodeScripts}`, { stdio: "inherit", encoding: "utf8" });
            } else {
              //errRequire.push(code[i]);
              boolArr.push(false);
            }
          });
        }
        if (isNPM || isLocal) boolArr.push(true);
        else {
          //errRequire.push(code[i]);
          boolArr.push(false);
        }
      }
      try {
        if (!boolArr.includes(false))
          res("This module has no invalid required npm package");
        else
          throw new Error(`This module has some invalid required npm package.`);
      } catch (e) {
        rej(e.toString());
      }
    });
  });
};

module.exports = async (main, directory, opts) => {
  if (!main)
    throw new Error(
      'No location provided of .js file where you require "moduleLoader.js"',
    );
  if (!directory) throw new Error("No directory provided");
  let loadedFuncList = {},
    failed = 0,
    success = 0;
  let loader = async (dir) => {
    dir = dir || ".";
    opts = opts || {};
    dir = path.resolve(parentDir, dir);
    let libs = fs.readdirSync(dir);
    libs = libs.filter((e) => e.split(".")[e.split(".").length - 1] === "js");
    let files = [];
    for (int = 0; int < libs.length; int++) {
      console.log(
        chalk.cyan.bold("[LOADER]"),
        chalk.bold("》"),
        chalk.bold(`Trying to load module "${libs[int]}"`),
      );
      let ts = process.hrtime();
      await requireChecker(dir + "/" + libs[int])
        .then(async (ok) => {
          files.push(libs[int]);
          success++;
          let t = process.hrtime(ts);
          console.log(
            chalk.magenta.bold("[LOADER]"),
            chalk.bold("》"),
            chalk.green.bold(
              `Module "${libs[int]}" took ${Math.floor(
                (t[0] * 1000 + t[1] / 1e6) / 1000,
              )} sec. to load!`,
            ),
          );
        })
        .catch((err) => {
          failed++;
          console.log(
            chalk.hex("#FFA500").bold("[LOADER]"),
            chalk.bold("》"),
            chalk.bold.red(
              `Failed to load Module "${libs[int]}"!\nReason: ${err}'`,
            ),
          );
        });
    }
    let filesForBase = {};
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let ext = path.extname(file);
      let base = path.basename(file, ext);
      (filesForBase[base] = filesForBase[base] || []).push(file);
    }
    let map = {};
    let extensions = opts.extensions || Object.keys(require.extensions);
    for (var base in filesForBase) {
      if (!filesForBase.hasOwnProperty(base)) continue;
      files = filesForBase[base];
      let filesMinusDirs = {};
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let abs = path.resolve(dir, file);
        if (abs === parentFile) continue;
        if (opts.filter && !opts.filter(abs)) continue;
        if (fs.statSync(abs).isDirectory()) {
          if (opts.recurse) {
            if (base === "node_modules") continue;
            map[base] = requireDir(abs, opts);
            if (opts.duplicates) map[file] = map[base];
          }
        } else filesMinusDirs[file] = abs;
      }
      if (map[base] && !opts.duplicates) continue;
      for (ext of extensions) {
        let file = base + ext;
        let abs = filesMinusDirs[file];
        if (abs) {
          if (/\.d\.ts$/.test(abs)) continue;
          if (opts.noCache) delete require.cache[abs];
          if (opts.duplicates) {
            map[file] = require(abs);
            if (!map[base]) map[base] = map[file];
          } else {
            map[base] = require(abs);
            break;
          }
        }
      }
    }
    if (opts.mapKey || opts.mapValue) {
      for (var base in map) {
        if (!map.hasOwnProperty(base)) continue;
        let newKey = opts.mapKey ? opts.mapKey(map[base], base) : base;
        let newVal = opts.mapValue
          ? opts.mapValue(map[base], newKey)
          : map[base];
        delete map[base];
        map[newKey] = newVal;
      }
    }
    Object.assign(loadedFuncList, map);
  };
  if (Array.isArray(directory)) {
    for (let _i = 0; _i < directory.length; _i++) {
      await loader(directory[_i]);
    }
  } else if (typeof directory === "string") {
    await loader(directory);
  }
  console.log(
    chalk.magenta.bold("[RESULTS]"),
    chalk.bold("》"),
    chalk.green.bold(`\nLoaded Modules: ${success}`),
    chalk.red.bold(`\nFailed to load Modules: ${failed}`),
  );
  return loadedFuncList;
};
