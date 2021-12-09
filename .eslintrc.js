module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  env: {
    node: true
  },
  globals: {
    Vue: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: [
    "vue"
  ],
  ignorePatterns: [],
  // Base linting rules to use
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-essential",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  // My custom rules to override the above base linting rules
  rules: {
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    // "space-before-function-paren": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "vue/no-multi-spaces": "off",

    // Which one?
    "object-property-newline": "off",
    "@typescript-eslint/object-property-newline": "off",

    // TODO: TEMPORARY! THESE SHOULD NOT BE OFF!!!
    // "@typescript-eslint/typedef": "off",
    // "no-process-env": "warn",
    // "no-underscore-dangle": "warn",
    // "no-magic-numbers": ["off"],
    // "typescript-eslint/type-annotation-spacing": "off",
    // "eslint@typescript-eslint/type-annotation-spacing": "off",

    // https://eslint.org/docs/rules/

    // Possible Errors
    "no-await-in-loop":"error",
    "no-constant-condition": "warn",
    "no-unreachable": "warn",

    // Best Practices
    "block-scoped-var": "error",
    "consistent-return": "error",
    "default-param-last": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "no-eval": "error",
    "no-extra-label": "warn",
    "no-floating-decimal": "error",
    "no-implicit-globals": "error",
    "no-loop-func": "error",
    "no-magic-numbers": ["warn", { ignore: [-1, 0, 1, 2, 3, 16, 32, 100], ignoreArrayIndexes: true }],
    "no-multi-spaces": "off",
    radix: ["error", "always"],
    "require-await": "error",

    // Variables
    "no-label-var": "error",
    "no-shadow": "error",
    "no-use-before-define": ["error", { functions: true, classes: true, variables: true }],
    "no-unmodified-loop-condition": "off",
    "vue/one-component-per-file": "off",

    // Node.js and CommonJS
    "no-buffer-constructor": "error",
    "no-path-concat": "error",
    // "no-process-env": "error", // NEW, remove this if it causes problems

    // Stylistic Rules
    "array-bracket-spacing": ["error", "never"],
    camelcase: ["warn", { properties: "never" }],
    "comma-dangle": ["error", "never"],
    "computed-property-spacing": ["error", "never"],
    "consistent-this": ["error", "that"],
    "eol-last": ["error", "always"],
    "func-call-spacing": ["error", "never"],
    "implicit-arrow-linebreak": ["error", "beside"],
    indent: ["error", 2, { SwitchCase: 1 }],
    "keyword-spacing": "error",
    "linebreak-style": ["error", "unix"],
    "new-cap": ["error", { capIsNew: false }],
    "no-multi-assign": "error",
    "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
    "no-negated-condition": "error",
    "no-new-object": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    // "no-underscore-dangle": "error", // NEW, remove this if it causes problems
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": ["error", "beside"],
    "one-var": ["error", "never"],
    "one-var-declaration-per-line": ["error", "always"],
    "operator-assignment": ["error", "always"],
    "padded-blocks": ["error", "never"],
    "prefer-exponentiation-operator": "error",
    "prefer-object-spread": "error",
    "quote-props": ["error", "as-needed"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "semi-spacing": "error",
    "semi-style": ["error", "last"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", { named: "never", asyncArrow: "always" }], // NEW, remove this if it causes problems
    "space-in-parens": ["error", "never"],
    "space-unary-ops": "error",
    "spaced-comment": ["error", "always"],
    "wrap-regex": "error",

    // ECMAScript 6
    "arrow-body-style": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "no-duplicate-imports": ["error", { includeExports: true }],
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",

    // Misc
    "key-spacing": "off",
    "object-curly-spacing": "off",
    "block-spacing": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",  // NEW, remove this if it causes problems
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", // NEW, remove this if it causes problems

    // TypeScript

    // "@typescript-eslint/typedef": [
    //   "error", {
    //     arrayDestructuring: true,
    //     arrowParameter: true,
    //     memberVariableDeclaration: true,
    //     objectDestructuring: true,
    //     parameter: true,
    //     propertyDeclaration: true,
    //     variableDeclaration: true,
    //     variableDeclarationIgnoreFunction: true
    //   }]

    // "@typescript-eslint/explicit-function-return-type": "error",
    // "@typescript-eslint/type-annotation-spacing": "off",
    // "@typescript-eslint/no-inferrable-types": "off",
    // "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
};
