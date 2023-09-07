// 用這隻 下指令 node process.js

// const fs = require("fs");
// const jsonStr = require("./tokens/figma-tokens.json");

// const { transformTokens } = require('token-transformer');

// const transformerOptions = {
//     expandTypography: true,
//     expandShadow: true,
//     expandComposition: true,
//     expandBorder: true,
//     preserveRawValue: false,
//     throwErrorWhenNotResolved:  true,
//     resolveReferences:true
// }

// const setsToUse = [];

// const resolved = transformTokens(jsonStr, setsToUse, [], transformerOptions);

// console.log('resolved', resolved)

// function processJsonValue(value, parentKey = "") {
//  let scssContent = "";

//  if (typeof value === "string" && parentKey !== "type") {
//    const variableName = `$${parentKey}`;
//    scssContent += `${variableName}: ${value};\n`;
//  } else if (typeof value === "object") {
//    Object.keys(value).forEach((key) => {
//      if (key !== "type") {
//        const newParentKey = parentKey !== "" ? `${parentKey}-${key}` : key;
//        scssContent += processJsonValue(value[key], newParentKey);
//      }
//    });
//  }

//  return scssContent;
// }

// let scssContent = processJsonValue(resolved);
// fs.writeFileSync("test.module.scss", scssContent);
// console.log("Conversion complete.");

// =================已上是royal & edward的版本 但是會編譯不出來 多層物件

// const fs = require("fs");
// const testJson = require("./tokens/figma-tokens.json");

// function processJsonValue(value, parentKey = "") {
//  let scssContent = "";

//  if (typeof value === "string" && parentKey !== "type") {
//    const variableName = `$${parentKey}`;
//    scssContent += `${variableName}: ${value};\n`;
//  } else if (typeof value === "object") {
//    Object.keys(value).forEach((key) => {
//      if (key !== "type") {
//        const newParentKey = parentKey !== "" ? `${parentKey}-${key}` : key;
//        scssContent += processJsonValue(value[key], newParentKey);
//      }
//    });
//  }

//  return scssContent;
// }

// let scssContent = processJsonValue(testJson);
// fs.writeFileSync("test.module.scss", scssContent);
// console.log("Conversion complete.");





const fs = require("fs");
const testJson = require("./tokens/figma-tokens.json");

function processJsonValue(value, parentKey = "") {
  let scssContent = "";

  if (typeof value === "string" && parentKey !== "type") {
    const variableName = `$${parentKey}`;
    scssContent += `${variableName}: ${value};\n`;
  } else if (typeof value === "object") {
    // Check if the object has a "type" property and its value is "color".
    if (value.type === "color") {
      // Check if the "value" property is a reference like "{base.primary.80}".
      if (typeof value.value === "string" && value.value.startsWith("{") && value.value.endsWith("}")) {
        const referencePath = value.value.slice(1, -1); // Remove curly braces
        const referenceValue = getNestedValue(testJson, referencePath);
        if (referenceValue !== undefined) {
          // Replace the reference with its actual value.
          scssContent += `$${parentKey}:${referenceValue};\n`;
        }
      } else {
        // Process the object as usual.
        Object.keys(value).forEach((key) => {
          if (key !== "type") {
            const newParentKey = parentKey !== "" ? `${parentKey}-${key}` : key;
            scssContent += processJsonValue(value[key], newParentKey);
          }
        });
      }
    } else {
      // Process the object as usual.
      Object.keys(value).forEach((key) => {
        if (key !== "type") {
          const newParentKey = parentKey !== "" ? `${parentKey}-${key}` : key;
          scssContent += processJsonValue(value[key], newParentKey);
        }
      });
    }
  }

  return scssContent;
}

function getNestedValue(obj, path) {
  const keys = path.split(".");
  let nestedValue = obj;

  for (const key of keys) {
    nestedValue = nestedValue[key];
    if (nestedValue === undefined) {
      return undefined;
    }
  }

  return nestedValue.value;
}

let scssContent = processJsonValue(testJson);
fs.writeFileSync("test.module.scss", scssContent);
console.log("Conversion complete.");
