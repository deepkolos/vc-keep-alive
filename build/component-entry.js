const fs = require('fs');
const path = require('path');
const upperCamelCase = require('uppercamelcase');
const components = require('../demo/components/index.json');

let output = `import Vue from 'vue';

`;

if (!components.length) return;

output = components.reduce((output, name) => {
  output += `import ${upperCamelCase(name)} from './components/${name}.vue';\n`;
  return output;
}, output);

output = components.reduce((output, name) => {
  output += `Vue.component(${upperCamelCase(name)}.name, ${upperCamelCase(name)});\n`;
  return output;
}, output + '\n');

fs.writeFileSync(path.resolve(__dirname, '../demo/components.js'), output);