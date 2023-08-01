var fs = require('fs');
var path = require('path');
const chalk = require('chalk');
const exec = require('child_process').exec;

var parent = module.parent;
var parentFile = parent.filename;
var parentDir = path.dirname(parentFile);
delete require.cache[__filename];

let cmd  = (absPath,libs) => {
    return new Promise((res,rej)=>{
        let ts = process.hrtime()
        let child = exec(`node ${absPath}/${libs}`,(error, stdout, stderr) => {
            if (Boolean(`${stderr}`)) {
                rej(chalk.hex('#FFA500').bold("[LOADER]")+' '+chalk.bold.red(`Failed to load Module "${libs}"!\nReason: ${stderr.split('\n\n')[0]}'`))
            }else{
                let t = process.hrtime(ts)
                console.log(chalk.magenta.bold("[LOADER]"),chalk.green.bold(`Module "${libs}" took ${t[0]*1000 + t[1]/1e6} ms to load!`))
                res(libs)
            }
        });
    })
}

module.exports = async(dir, opts) => {
    dir = dir || '.';
    opts = opts || {};
    dir = path.resolve(parentDir, dir);
    let libs = fs.readdirSync(dir);
    libs = libs.filter(e=>e.split('.')[e.split('.').length-1]==='js')
    let files = []
    for (let i=0;i<libs.length;i++){
        try {
            let lib = await cmd(dir,libs[i])
            files.push(lib)
        } catch(e){
            console.log(e)
        }
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
                    if (base === 'node_modules') continue;
                    map[base] = requireDir(abs, opts);
                    if (opts.duplicates) map[file] = map[base];
                }
            }
            else filesMinusDirs[file] = abs;
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
            let newVal = opts.mapValue ? opts.mapValue(map[base], newKey) : map[base];
            delete map[base];
            map[newKey] = newVal;
        }
    }
    return map
    /*let reformattedObj = {};
    for (let prop in map) {
        for (let nestedProp in map[prop]) {
            reformattedObj[nestedProp] = map[prop][nestedProp];
        }
    }
    return reformattedObj;*/
};
