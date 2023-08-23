// 用這隻 下指令 node process.js

const fs = require("fs");
const jsonStr = require("./tokens/figma-tokens.json");

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

function processJsonValue(value, parentKey = "") {
 let scssContent = "";

 if (typeof value === "string" && parentKey !== "type") {
   const variableName = `$${parentKey}`;
   scssContent += `${variableName}: ${value};\n`;
 } else if (typeof value === "object") {
   Object.keys(value).forEach((key) => {
     if (key !== "type") {
       const newParentKey = parentKey !== "" ? `${parentKey}-${key}` : key;
       scssContent += processJsonValue(value[key], newParentKey);
     }
   });
 }

 return scssContent;
}

let scssContent = processJsonValue(resolved);
fs.writeFileSync("test.module.scss", scssContent);
console.log("Conversion complete.");