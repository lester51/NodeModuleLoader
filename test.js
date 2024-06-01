(async()=>{
const requires = require('module-loader-installer')

/*
* @params {<array>|<string>} location of your local modules you want to import.
*/

//To load all local modules from multiple folders at once
//let modulesLoaded = await requires(__filename,['directory1','directory2','directory3'......])
//console.log(modulesLoaded)
//To load all local modules from a single directory
let modulesLoaded = await requires(__filename,'sample_modules')
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
