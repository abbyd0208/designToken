const fs = require("fs");
const testJson = require("./tokens/figma-tokens.json");

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

let scssContent = processJsonValue(testJson);
fs.writeFileSync("test.module.scss", scssContent);
console.log("Conversion complete.");