// According to MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#language_tag_syntax
// REQUIRED 2-3 letters defines the basic language
const languageSubtag = '([a-z]{2,3})';
// OPTIONAL 4 letters defines the writing system
const scriptSubtag = '(-[a-z]{4}){0,1}';
// OPTIONAL 2 letters or 3 numbers define the dialect
const regionSubtag = '(-([a-z]{2}|[0-9]{3})){0,1}';

const localeRegexString = `^${languageSubtag}${scriptSubtag}${regionSubtag}$`;
const localeRegex = new RegExp(localeRegexString);

module.exports = { localeRegex, localeRegexString };
