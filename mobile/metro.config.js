// The app shares the website's course and alphabet data in ../lib, so Metro
// has to watch that folder too.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '../lib')];

module.exports = config;
