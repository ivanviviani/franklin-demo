import ffetch from "../../scripts/ffetch.js";
import { loadCSS } from "../../scripts/lib-franklin.js";
import { getLanguageFromPathname, prependSlash } from "../../scripts/utils.js";

function createBreadcrumbListItem(crumb) {
  const li = document.createElement("li");
  if (crumb.url_path) {
    const a = document.createElement("a");
    a.textContent = crumb.name;
    a.href = crumb.url_path;
    li.appendChild(a);
  } else {
    li.textContent = crumb.name;
  }
  return li;
}

function skipParts(pathSplit) {
  const partsToSkip = [];// ["en", "it"];
  return pathSplit.filter((item) => !partsToSkip.includes(item));
}

/**
 * Skip crumb filter.
 * @param {{
 *   name: string,
 *   url_path: string,
 * }} crumb The crumb
 */
function skipCrumbFilter(crumb) {
  if (!crumb.url_path) return true;
  const crumbPathsToSkip = ["/en","/it","/blog","/news"];
  return !crumbPathsToSkip.includes(crumb.url_path.slice(crumb.url_path.lastIndexOf("/")));
}

const customBreadcrumbs = {
  "/it": {
    name: "IT",
    url_path: "/it",
  },
  "/en": {
    name: "EN",
    url_path: "/en",
  },
  // "app-note": {
  //   name: "App Note",
  //   url_path:
  //     "https://www.moleculardevices.com/search-results#t=All&sort=relevancy&f:@md_contenttype=%5BApplication%20Note%5D",
  // },
  // ebook: {
  //   name: "EBook",
  //   url_path:
  //     "https://www.moleculardevices.com/search-results#t=All&sort=relevancy&f:@md_contenttype=%5BeBook%5D",
  // },
  // "lab-notes": {
  //   name: "Lab Notes",
  //   url_path: "/lab-notes",
  // },
  // "/lab-notes/general": {
  //   name: "General",
  //   url_path: "/lab-notes/blog#General",
  // },
  // "/lab-notes/clone-screening": {
  //   name: "Clone Screening",
  //   url_path: "/lab-notes/blog#Clone-Screening",
  // },
  // "/lab-notes/cellular-imaging-systems": {
  //   name: "Cellular Imaging Systems",
  //   url_path: "/lab-notes/blog#Cellular-Imaging-Systems",
  // },
  // "/lab-notes/microplate-readers": {
  //   name: "Microplate Readers",
  //   url_path: "/lab-notes/blog#Microplate-Readers",
  // },
  // "service-support": {
  //   name: "Service and Support",
  //   url_path: "/service-support",
  // },
};

function getCustomUrl(path, part) {
  if (customBreadcrumbs[part]) {
    return customBreadcrumbs[part].url_path;
  }

  if (customBreadcrumbs[path]) {
    return customBreadcrumbs[path].url_path;
  }

  return null;
}

function getName(pageIndex, path, part, current) {
  if (customBreadcrumbs[part]) {
    return customBreadcrumbs[part].name;
  }

  if (customBreadcrumbs[path]) {
    return customBreadcrumbs[path].name;
  }

  const pg = pageIndex.find((page) => page.path === path);
  if (pg && pg.h1 && pg.h1 !== "0") {
    return pg.h1;
  }

  if (pg && pg.title && pg.title !== "0") {
    return pg.title;
  }

  if (current) {
    return document.title;
  }

  return part;
}

export default async function createBreadcrumbs(container) {
  const breadCrumbsCSS = new Promise((resolve) => {
    loadCSS("/blocks/breadcrumbs/breadcrumbs.css", (e) => resolve(e));
  });

  const path = window.location.pathname;
  const pathSplit = skipParts(path.split("/"));

  const pageIndex = await ffetch(`/${getLanguageFromPathname(path)}/query-index.json`).all();
  const urlForIndex = (index) =>
    prependSlash(pathSplit.slice(1, index + 2).join("/"));

  const breadcrumbs = [
    // {
    //   name: "Home",
    //   url_path: "/",
    // },
    ...pathSplit.slice(1, -1).map((part, index) => {
      const url = urlForIndex(index);
      return {
        name: getName(pageIndex, url, part, false),
        url_path: getCustomUrl(url, part) || url,
      };
    }),
    { name: getName(pageIndex, path, pathSplit[pathSplit.length - 1], true) },
  ];

  // filter crumbs
  const filtered = breadcrumbs.filter(skipCrumbFilter);
  if (filtered.length <= 1) {
    // no breadcrumb with a single crumb
    container?.closest('.breadcrumbs-wrapper')?.remove();
    return;
  }

  const ol = document.createElement("ol");
  filtered.forEach((crumb) => {
    ol.appendChild(createBreadcrumbListItem(crumb));
  });
  container.appendChild(ol);
  await breadCrumbsCSS;
}
