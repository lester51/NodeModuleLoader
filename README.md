# FEATURES

- _Load all functions of all your local modules at once just provide a folder path where your .js files located._
- _Auto install all missing dependencies/npm packages used by the .js files (by looking at requires at your code)._
- _Auto check if its a local module or npm package module._
- _Can load all local module from multiple directory just provide an array of directory(string)._
- _Will not load/import the module if theres an invalid module or error on the code._


Want to use? Currently I didn't make it an NPM Package yet so if you want to use it please clone this repository
```
git clone https://github.com/lester51/NodeModuleLoader
```
and to run a test
```js
node index //node index.js
```
## Simple Usage
```js
const requires = require('./moduleLoader.js')

(async()=>{
//To load all modules from multiple directories
let modulesLoaded = await requires(__filename,['directory1','directory2','directory3'......])
console.log(modulesLoaded)

//To load all module from a single directory
let modulesLoaded = await requires(__filename,'directory1')
console.log(modulesLoaded)
})()
```
