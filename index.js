(async()=>{
const requires = require('./moduleLoader.js')

/*
* params@{directory} > location of your local modules you want to import.
*/
let modulesLoaded = await requires('./sample_modules',__filename))
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
