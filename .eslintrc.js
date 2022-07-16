module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "node": true,
      "jest": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "prettier/@typescript-eslint"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "project": "tsconfig.json",
      "sourceType": "module"
  },
  "plugins": [
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
  ],
  "root": true,
  "rules": {
      "ident": [
          "error",
          "tab"
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ]
  }

}
