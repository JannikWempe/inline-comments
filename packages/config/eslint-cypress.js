module.exports = {
    "extends": [
      "plugin:cypress/recommended",
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
    ],
    "ignorePatterns": ["!**/*"],
    "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {}
    },
    {
      "files": ["src/plugins/index.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off"
      }
    }
  ]
}
