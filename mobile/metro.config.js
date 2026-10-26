// The app shares the website's course and alphabet data in ../lib, so Metro
// has to watch that folder too.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const lib = path.resolve(__dirname, '../lib');
config.watchFolders = [lib];

// Files in ../lib that import React must get the app's copy, not the website's
// (two Reacts in one app break hooks).
const fromApp = path.join(__dirname, 'package.json');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (context.originModulePath.startsWith(lib) && (moduleName === 'react' || moduleName.startsWith('react/'))) {
    return context.resolveRequest({ ...context, originModulePath: fromApp }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
