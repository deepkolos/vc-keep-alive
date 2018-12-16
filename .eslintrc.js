const IS_PROD = process.env.NODE_ENV === 'production';

// prettier-ignore
module.exports = {
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    // "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "parser": "babel-eslint"
  },
  "env": {
    "node": true,
    "browser": true
  },
  "globals": {
    "it": true,
    "xit": true,
    "pit": true,
    "jest": true,
    "test": true,
    "runs": true,
    "expect": true,
    "mockFn": true,
    "config": true,
    "require": true,
    "describe": true,
    "waitsFor": true,
    "xdescribe": true,
    "afterEach": true,
    "beforeEach": true
  },
  "rules": {
    "no-new": 0,
    "no-empty": 2,
    "no-eq-null": 2,
    "no-unreachable": 0,
    "no-fallthrough": 0,
    "no-tabs": "off",
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "vue/require-v-for-key": "off",
    "no-unexpected-multiline": "off",
    "space-before-function-paren": "off",
    "no-console": [ IS_PROD ? "warn" : "off"],
    "no-debugger": [ IS_PROD ? "warn" : "off"],
    "standard/computed-property-even-spacing": "off",
    "vue/no-side-effects-in-computed-properties": "warn",
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    "indent": [IS_PROD ? "warn" : "off", 2, { "SwitchCase": 1 }],
    "vue/no-unused-components": "off",
    "no-useless-escape": "off",
    "vue/no-use-v-if-with-v-for": "off"
  },
  "plugins": ["standard", "vue", "prettier"]
}
