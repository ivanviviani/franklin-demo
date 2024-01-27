/* eslint-disable no-console */
const fs = require('fs');
// eslint-disable-next-line import/extensions
const packageJson = require('../package.json');

const LOG_TAG = '[BUILD_DEPS]:';
const DEPENDENCIES_JSON_PATH = 'scripts/dependencies.json';
const UTF8 = 'utf8';
const COLORED_LOGGERS = new Map([
  ['green', (text) => console.log(`${LOG_TAG} \x1b[1;92m${text}\x1b[0m`)],
  ['yellow', (text) => console.log(`${LOG_TAG} \x1b[1;93m${text}\x1b[0m`)],
  ['red', (text) => console.log(`${LOG_TAG} \x1b[1;91m${text}\x1b[0m`)],
  ['cyan', (text) => console.log(`${LOG_TAG} \x1b[1;96m${text}\x1b[0m`)],
]);
function colorTrace(msg, color) {
  return COLORED_LOGGERS.has(color)
    ? COLORED_LOGGERS.get(color)(msg)
    : COLORED_LOGGERS.get('cyan')(msg);
}

fs.readFile(DEPENDENCIES_JSON_PATH, UTF8, (readError) => {
  // verify file was loaded.
  if (readError) {
    colorTrace(readError, 'yellow');
  }

  // initialize dependencies object
  const dependencies = [];

  const removeTrailingSlash = (string) => string.replace(/\/$/, '');

  const removeLeadingSlash = (string) => string.replace(/^\//, '');

  // eslint-disable-next-line max-len
  const createURL = (path, filename, isRootPath) => `${isRootPath ? '/' : ''}${removeTrailingSlash(path)}/${removeLeadingSlash(filename)}`;

  // function to add dependencies to the dependencies object
  const addDependency = (category, url, attrs, isModule = false) => {
    const filename = url.split('/')?.pop();
    if (filename?.endsWith('.css')) {
      dependencies.push({
        type: 'css',
        href: url,
        attrs,
        isModule,
      });
    } else if (filename?.endsWith('.js')) {
      dependencies.push({
        category,
        type: 'js',
        src: url,
        attrs,
        isModule,
      });
    }
  };

  // loop through the dependencies and add them to the dependencies object
  packageJson.copyDependencies?.forEach((dependency) => {
    const { to, fileIncludes } = dependency;
    if (Array.isArray(fileIncludes)) {
      fileIncludes.forEach((fileInclude) => {
        const url = createURL(to, fileInclude.file, true);
        addDependency(fileInclude.category, url, fileInclude.attributes, !!fileInclude.isModule);
      });
    } else if (typeof fileIncludes === 'object') {
      const url = createURL(to, fileIncludes.file, true);
      addDependency(fileIncludes.category, url, fileIncludes.attributes, !!fileIncludes.isModule);
    } else if (typeof fileIncludes === 'string') {
      const url = createURL(to, fileIncludes, true);
      addDependency(undefined, url);
    }
  });

  packageJson.externalDependencies?.forEach((dependency) => {
    const {
      name, url, attributes, isModule,
    } = dependency;
    addDependency(name, url, attributes, !!isModule);
  });

  // write the dependencies object to the dependencies.json file
  fs.writeFile(
    DEPENDENCIES_JSON_PATH,
    JSON.stringify(dependencies, null, 2),
    UTF8,
    (writeError) => {
      if (writeError) return colorTrace(readError, 'red');
      return colorTrace('The dependencies file was updated!', 'green');
    },
  );

  return true;
});
