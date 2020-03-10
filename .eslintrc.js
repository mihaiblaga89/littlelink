module.exports =  {
  parser:  '@typescript-eslint/parser',  
  extends:  [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/eslint-recommended",
    'prettier/@typescript-eslint', 
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "jest", "prettier"],
  parserOptions:  {
    ecmaVersion:  2018, 
    sourceType:  'module',
    project: './tsconfig.json',
  },
  rules:  {},
};