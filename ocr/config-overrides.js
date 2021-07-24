// from https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin));
  return config;
};
