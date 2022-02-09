const withTM = require("next-transpile-modules")(["ui", "api-mock"]);

module.exports = withTM({
  reactStrictMode: true,
});
