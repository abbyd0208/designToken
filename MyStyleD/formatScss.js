// const fs = require("fs");
const jsonStr = require("./tokens/figma-tokens.json");

// console.log('jsonStr', jsonStr)

// const outputJson = {};

// for (const key in jsonStr) {
//     outputJson[key] = {};
//     for (const subKey in jsonStr[key]) {
//       const subObj = jsonStr[key][subKey].value;
//       outputJson[key][subKey] = {};
      
//       if (Object.keys(subObj).length === 1) {
//         outputJson[key][subKey] = { "value": subObj };
//       } else {
//         for (const subSubKey in subObj) {
//           outputJson[key][subKey][subSubKey] = { "value": subObj[subSubKey] };
//         }
//       }
//     }
// }

// let scssContent = outputJson;
// console.log('outputJson', outputJson)
// fs.writeFileSync("test.json", scssContent);
// console.log("Conversion complete.");

const { transformTokens } = require('token-transformer');

const transformerOptions = {
    expandTypography: true,
    expandShadow: true,
    expandComposition: true,
    expandBorder: true,
    preserveRawValue: false,
    throwErrorWhenNotResolved:  true,
    resolveReferences:true
}

const setsToUse = [];

const resolved = transformTokens(jsonStr, setsToUse, [], transformerOptions);

console.log('resolved', resolved)