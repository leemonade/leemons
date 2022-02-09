const findOne = require('./findOne');
const update = require('./update');
const { isProfilesConfig } = require('./isProfilesConfig');
const { getProfiles } = require('./getProfiles');
const { setProfiles } = require('./setProfiles');

module.exports = { findOne, update, isProfilesConfig, getProfiles, setProfiles };
