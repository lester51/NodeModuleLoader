# FEATURES

- _Load all functions of all your local modules at once just provide a folder path where your .js files located._
- _Auto install all missing dependencies/npm packages used by the .js files (by looking at requires at your code)._
- _Auto check if its a local module or npm package module._
- _Can load all local module from multiple directory just provide an array of directory(string)._
- _Will not load/import the module if theres an invalid module or error on the code._

#### New Feature (much faster)
- _Skip checks for local modules like `../../folder/file.js` and native modules like `fs` `assert` `process' etc.._
- _Checks custom modules that you add on `node_modules` folder that doesn't have `package.json`._

# Installation
```
npm i module-loader-installer
```

# SUPPORTS BOTH CJS (require) AND ESM (import)
```
//ECMASCRIPT MODULE
import requires from 'module-loader-installer';

//COMMON JS
const requires = require('module-loader-installer');
```

## Simple Usage
```js
//ECMASCRIPT MODULE
import requires from 'module-loader-installer';
//COMMON JS
const requires = require('module-loader-installer');

(async()=>{
/*
* @params {<array>|<string>} location of your local modules you want to import.
*/
//To load all modules from multiple directories
let modulesLoaded = await requires(__filename,['directory1','directory2','directory3',...])
console.log(modulesLoaded)

//To load all module from a single directory
let modulesLoaded = await requires(__filename,'directory1')
console.log(modulesLoaded)
/* THIS IS THE SAMPLE LOADED MODULES OBJECT STRUCTURE
//{ [fileName] : { [funcName] : [functionInside (anonymous/named)] } }
{
  test1: { a: [Function (anonymous)] },
  test2: { a: [Function (anonymous)], b: [Function (anonymous)] },
  test3: { a: [Function: a], b: [Function: b] },
  test5: [Function (anonymous)],
  test6: [Function (anonymous)],
  test7: [Function (anonymous)] { T: [Function (anonymous)] }
}

//To access these exported modules
console.log(modulesLoaded.test1.a())
console.log(modulesLoaded.test2.a()) or console.log(modulesLoaded.test2.b())
console.log(modulesLoaded.test3.a()) or console.log(modulesLoaded.test3.b())
console.log(modulesLoaded.test5())
console.log(modulesLoaded.test6()) //check test6.js file for more info.
console.log(modulesLoaded.test7()) or console.log(modulesLoaded.test7.T())
*/
})()
```
