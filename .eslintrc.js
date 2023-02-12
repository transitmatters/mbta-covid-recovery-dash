module.exports = {
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "prettier",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 11,
        sourceType: "module",
    },
    plugins: ["react", "prettier", "@typescript-eslint"],
    rules: {
        "import/no-anonymous-default-export": 0,
        "react/display-name": 0,
        "react/react-in-jsx-scope": 0,
        "react/no-unescaped-entities": 0,
        "react-hooks/exhaustive-deps": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/indent": 0,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_+$" }],
        "@typescript-eslint/no-use-before-define": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "no-constant-condition": 0,
        "prettier/prettier": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
