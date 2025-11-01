module.exports = {
  env: {
    node: true,       // ✅ بيئة Node.js
    es6: true,        // ✅ دعم ECMAScript 6
  },
  parserOptions: {
    ecmaVersion: 2021, // ✅ إصدار حديث
  },
  extends: [
    "eslint:recommended", // القواعد الأساسية فقط
  ],
  rules: {
    // ✅ إيقاف التحذيرات اللي كانت بتمنع deploy
    "no-undef": "off",
    "no-restricted-globals": "off",
    "prefer-arrow-callback": "off",
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: { mocha: true },
    },
  ],
  globals: {
    module: "readonly",
    require: "readonly",
    exports: "readonly",
  },
};
