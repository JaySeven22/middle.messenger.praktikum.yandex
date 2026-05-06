export default {
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$",
      {
        message:
          "Expected class selector to use BEM kebab-case (block, block__element, block--modifier, block__element--modifier)",
      },
    ],
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "value-keyword-case": ["lower", { ignoreKeywords: ["currentColor"] }],
  },
};
