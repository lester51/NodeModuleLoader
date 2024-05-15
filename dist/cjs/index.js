var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var _a = require("child_process"), execSync = _a.execSync, exec = _a.exec;
var isValidNPM = require("npm-exists");
var strip = require("strip-comments");
var globPromise = require("file-path-helper").globPromise;
var util = require('util');
var axios = require('axios');
var readDirectory = util.promisify(fs.readdir);
var parent = module.parent;
var parentFile = parent.filename;
var parentDir = path.dirname(parentFile);
delete require.cache[__filename];
var isBuiltIn = function (name) {
    var nativeModules = Object.keys(process.binding('natives'));
    if (~nativeModules.indexOf(name))
        return true;
    else
        return false;
};
var requireChecker = function (dir) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (res, rej) {
                fs.readFile(dir, "utf8", function (err, data) {
                    return __awaiter(this, void 0, void 0, function () {
                        var code, boolArr_1, i, test, isNPMInstalled, isNPM, isLocal;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    code = strip(data).match(/require\((.*?)\)/g);
                                    if (!(code == null)) return [3, 1];
                                    exec("node ".concat(dir), function (error, stdout, stderr) {
                                        if (error) {
                                            rej(error.toString());
                                            return;
                                        }
                                        res("This module doesn't have required npm package");
                                    });
                                    return [3, 12];
                                case 1:
                                    code = code.join().match(/((\"(.*?)\")|(\'(.*?)\')|(\`(.*?)\`))/g).join().replace(/[\"\'\`]/g, "").split(",");
                                    boolArr_1 = [];
                                    i = 0;
                                    _a.label = 2;
                                case 2:
                                    if (!(i < code.length)) return [3, 11];
                                    return [4, readDirectory('node_modules/' + code[i]).catch(function (e) { return String(e); })];
                                case 3:
                                    test = _a.sent();
                                    isNPMInstalled = (!isCoreModule(code[i]) && (Array.isArray(test) && test.includes('package.json'))) ? true : false;
                                    if (!isCoreModule(code[i])) return [3, 4];
                                    boolArr_1.push(true);
                                    return [3, 10];
                                case 4:
                                    if (!isNPMInstalled) return [3, 5];
                                    boolArr_1.push(true);
                                    return [3, 10];
                                case 5: return [4, isValidNPM(code[i]).then(function (isNPM) { return isNPM; })];
                                case 6:
                                    isNPM = _a.sent();
                                    return [4, globPromise(code[i].split("/").splice(-2).join("/")).then(function (filePathList) { return (filePathList.length !== 0 ? true : false); })];
                                case 7:
                                    isLocal = _a.sent();
                                    if (!isNPM) return [3, 9];
                                    return [4, new Promise(function (resolve, reject) {
                                            exec("node ".concat(dir), function (error, stdout, stderr) {
                                                if (error) {
                                                    reject(error);
                                                    return;
                                                }
                                                resolve(stdout);
                                            });
                                        }).catch(function (err) {
                                            var match = String(err).match(/Cannot find module '(.*)'/);
                                            if (match && !match[1].startsWith(".")) {
                                                var nodeScripts = eval("let a=()=>{arr=".concat(err.toString().match(/requireStack: \[(.*?)\]/g)[0].match(/\[(.*?)\]/g)[0], ";return arr;};a();")).map(function (e) { return "node ".concat(e, " &&"); }).join(" ").split("&&").filter(function (e) { return e !== ""; }).join("&&");
                                                execSync("npm i ".concat(match[1], " --save --non-interactive --no-bin-links --ignore-engines --skip-integrity-check"), { stdio: "inherit", encoding: "utf8" });
                                                exec("".concat(nodeScripts), { stdio: "inherit", encoding: "utf8" });
                                            }
                                            else {
                                                boolArr_1.push(false);
                                            }
                                        })];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9:
                                    if (isNPM || isLocal)
                                        boolArr_1.push(true);
                                    else {
                                        boolArr_1.push(false);
                                    }
                                    _a.label = 10;
                                case 10:
                                    ++i;
                                    return [3, 2];
                                case 11:
                                    try {
                                        if (!boolArr_1.includes(false))
                                            res("This module has no invalid required npm package");
                                        else
                                            throw new Error("This module has some invalid required npm package.");
                                    }
                                    catch (e) {
                                        rej(e.toString());
                                    }
                                    _a.label = 12;
                                case 12: return [2];
                            }
                        });
                    });
                });
            })];
    });
}); };
module.exports = function (main, directory, obj, opts) { return __awaiter(_this, void 0, void 0, function () {
    var loadedFuncList, filesToWatch, failed, success, loader, _i;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!main)
                    throw new Error('No location provided of .js file where you require "moduleLoader.js"\n\nHint: use "__filename" to get the full path with basename and extention.');
                if (!directory)
                    throw new Error("No directory provided");
                loadedFuncList = {}, filesToWatch = [], failed = 0, success = 0;
                loader = function (dir) { return __awaiter(_this, void 0, void 0, function () {
                    var libs, files, _loop_1, filesForBase, i_1, file, ext, base_1, map, extensions, base, filesMinusDirs, i, file, abs, _a, extensions_1, file, abs, base, newKey, newVal;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                dir = dir || ".";
                                opts = opts || {};
                                dir = path.resolve(parentDir, dir);
                                libs = fs.readdirSync(dir);
                                libs = libs.filter(function (e) { return e.split(".")[e.split(".").length - 1] === "js"; });
                                files = [];
                                _loop_1 = function () {
                                    var ts;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                console.log(chalk.cyan.bold("[LOADER]"), chalk.bold("》"), chalk.bold("Trying to load module \"".concat(libs[int], "\"")));
                                                ts = process.hrtime();
                                                console.log("".concat(dir, "/").concat(libs[int]));
                                                return [4, requireChecker("".concat(dir, "/").concat(libs[int]))
                                                        .then(function (ok) { return __awaiter(_this, void 0, void 0, function () {
                                                        var t;
                                                        return __generator(this, function (_a) {
                                                            filesToWatch.push(dir + '/' + libs[int]);
                                                            files.push(libs[int]);
                                                            success++;
                                                            t = process.hrtime(ts);
                                                            console.log(chalk.magenta.bold("[LOADER]"), chalk.bold("》"), chalk.green.bold("Module \"".concat(libs[int], "\" took ").concat(Math.floor((t[0] * 1000 + t[1] / 1e6) / 1000), " sec. to load!")));
                                                            return [2];
                                                        });
                                                    }); })
                                                        .catch(function (err) {
                                                        failed++;
                                                        console.log(chalk.hex("#FFA500").bold("[LOADER]"), chalk.bold("》"), chalk.bold.red("Failed to load Module \"".concat(libs[int], "\"!\nReason: ").concat(err, "'")));
                                                    })];
                                            case 1:
                                                _c.sent();
                                                return [2];
                                        }
                                    });
                                };
                                int = 0;
                                _b.label = 1;
                            case 1:
                                if (!(int < libs.length)) return [3, 4];
                                return [5, _loop_1()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                int++;
                                return [3, 1];
                            case 4:
                                filesForBase = {};
                                for (i_1 = 0; i_1 < files.length; i_1++) {
                                    file = files[i_1];
                                    ext = path.extname(file);
                                    base_1 = path.basename(file, ext);
                                    (filesForBase[base_1] = filesForBase[base_1] || []).push(file);
                                }
                                map = {};
                                extensions = opts.extensions || Object.keys(require.extensions);
                                for (base in filesForBase) {
                                    if (!filesForBase.hasOwnProperty(base))
                                        continue;
                                    files = filesForBase[base];
                                    filesMinusDirs = {};
                                    for (i = 0; i < files.length; i++) {
                                        file = files[i];
                                        abs = path.resolve(dir, file);
                                        if (abs === parentFile)
                                            continue;
                                        if (opts.filter && !opts.filter(abs))
                                            continue;
                                        if (fs.statSync(abs).isDirectory()) {
                                            if (opts.recurse) {
                                                if (base === "node_modules")
                                                    continue;
                                                map[base] = requireDir(abs, opts);
                                                if (opts.duplicates)
                                                    map[file] = map[base];
                                            }
                                        }
                                        else
                                            filesMinusDirs[file] = abs;
                                    }
                                    if (map[base] && !opts.duplicates)
                                        continue;
                                    for (_a = 0, extensions_1 = extensions; _a < extensions_1.length; _a++) {
                                        ext = extensions_1[_a];
                                        file = base + ext;
                                        abs = filesMinusDirs[file];
                                        if (abs) {
                                            if (/\.d\.ts$/.test(abs))
                                                continue;
                                            if (opts.noCache)
                                                delete require.cache[abs];
                                            if (opts.duplicates) {
                                                map[file] = require(abs);
                                                if (!map[base])
                                                    map[base] = map[file];
                                            }
                                            else {
                                                map[base] = require(abs);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (opts.mapKey || opts.mapValue) {
                                    for (base in map) {
                                        if (!map.hasOwnProperty(base))
                                            continue;
                                        newKey = opts.mapKey ? opts.mapKey(map[base], base) : base;
                                        newVal = opts.mapValue
                                            ? opts.mapValue(map[base], newKey)
                                            : map[base];
                                        delete map[base];
                                        map[newKey] = newVal;
                                    }
                                }
                                Object.assign(loadedFuncList, map);
                                return [2];
                        }
                    });
                }); };
                if (!Array.isArray(directory)) return [3, 5];
                _i = 0;
                _a.label = 1;
            case 1:
                if (!(_i < directory.length)) return [3, 4];
                return [4, loader(directory[_i])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                if (!(typeof directory === "string")) return [3, 7];
                return [4, loader(directory)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                console.log(chalk.magenta.bold("[RESULTS]"), chalk.bold("》"), chalk.green.bold("\nLoaded Modules: ".concat(success)), chalk.red.bold("\nFailed to load Modules: ".concat(failed)));
                return [2, loadedFuncList];
        }
    });
}); };
//# sourceMappingURL=index.js.map