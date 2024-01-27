import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  decorateBlock,
  loadBlock,
  toClassName,
  getMetadata,
} from './lib-franklin.js';

// Load a list of dependencies the site needs
const loadDependenciesPromise = fetch(`${window.hlx.codeBasePath}/scripts/dependencies.json`)
  .then((res) => res.json())
  // eslint-disable-next-line no-use-before-define
  .then(loadDependencies);

const dependencyScripts = [];

/**
 * to add/remove a template, just add/remove it in the list below
 */
const TEMPLATE_LIST = [];

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * If breadcrumbs = auto in  Metadata, 1 create space for CLS, 2 load breadcrumbs block
 * Breadcrumb block created at the top of first section
 */
function createBreadcrumbsSpace(main) {
  if (getMetadata('breadcrumbs') === 'auto') {
    const blockWrapper = document.createElement('div');
    blockWrapper.classList.add('breadcrumbs-wrapper');
    main.prepend(blockWrapper);
  }
}
async function loadBreadcrumbs(main) {
  if (getMetadata('breadcrumbs') === 'auto') {
    const blockWrapper = main.querySelector('.breadcrumbs-wrapper');
    const block = buildBlock('breadcrumbs', '');
    blockWrapper.append(block);
    decorateBlock(block);
    await loadBlock(block);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    const templates = TEMPLATE_LIST;
    if (templates.includes(template)) {
      const mod = await import(`../templates/${template}/${template}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${template}/${template}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Template loading failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await decorateTemplates(main);
    decorateMain(main);
    createBreadcrumbsSpace(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 * @param {string} [rel] The favicon rel
 */
export function addFavIcon(href, rel = 'icon') {
  const link = document.createElement('link');
  link.rel = rel;
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector(`head link[rel="${rel}"]`);
  if (existingLink) {
    existingLink.replaceWith(link);
  } else {
    document.head.append(link);
  }
}

export async function fetchFragment(path, plain = true) {
  const response = await fetch(path + (plain ? '.plain.html' : ''));
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading fragment details', response);
    return null;
  }
  const text = await response.text();
  if (!text) {
    // eslint-disable-next-line no-console
    console.error('fragment details empty', path);
    return null;
  }
  return text;
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  loadHeader(doc.querySelector('header'));

  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));
  loadBreadcrumbs(main);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  doc.querySelectorAll('div:not([class]):not([id]):empty').forEach((empty) => empty.remove());
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

/**
 * Loads a JS file.
 * @param {string} src URL to the JS file
 * @param {Object} attrs additional optional attributes
 */
export async function loadScript(src, attrs, isModule = false) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const attr in attrs) {
          script.setAttribute(attr, attrs[attr]);
        }
      }
      if (isModule) {
        script.setAttribute('type', 'module');
      }
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    } else {
      resolve();
    }
  });
}

/**
 * Loads all dependencies in an async way so we can leverage
 * the browser's ability to load multiple resources in parallel.
 */
async function loadDependencies(dependenciesJSON) {
  dependenciesJSON?.forEach((dependency) => {
    if (dependency.type === 'js') {
      if (!dependency.attrs || !dependency.attrs.find((attr) => attr === 'async')) {
        dependencyScripts.push(loadScript(dependency.src, dependency.attrs, dependency.isModule));
      } else {
        dependencyScripts.push({
          category: dependency.category || dependency.src,
          script: loadScript(dependency.src, dependency.attrs, dependency.isModule),
        });
      }
    } else if (dependency.type === 'css') {
      loadCSS(dependency.href);
    }
  });
  await Promise.all(dependencyScripts);
}

export async function waitForDependency(dependencyCategory) {
  // make sure dependencies have been initialized
  await loadDependenciesPromise;
  const dependencies = dependencyScripts.filter((d) => d.category === dependencyCategory);
  if (dependencies && dependencies.length > 0) {
    return Promise.all(dependencies.map((d) => d.script));
  }
  return Promise.resolve();
}

loadPage();
