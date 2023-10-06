const DEFAULT_LANGUAGE = "en";
const DEV_ROOTS = ["dev","block-library","experiments"];

export function getLanguageFromPathname(pn = window.location.pathname) {
  const firstLevel = pn.split("/")[1];
  if (DEV_ROOTS.includes(firstLevel)) {
    return DEFAULT_LANGUAGE;
  }
  return firstLevel || DEFAULT_LANGUAGE;
}

/**
 * Read query string from url
 */
export function getQueryParameter() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params;
}

/**
 * Set a cookie
 * @param cname the name of the cookie
 * @param cvalue the value of the cookie
 * @param exdays the expiration days of a cookie
 */
export function setCookie(cname, cvalue, exdays) {
  const date = new Date();
  let hostName = "";
  let domain = "";
  let expires = "";
  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
  if (exdays !== 0) {
    expires = `expires=${date.toUTCString()}`;
  }

  domain = window.location.hostname.endsWith(".hlx.live");
  if (domain === true) {
    hostName = "domain=.hlx.live;";
  }
  document.cookie = `${cname}=${cvalue};secure;${hostName}${expires};path=/`;
}

/**
 * Get a cookie
 * @param cname the name of the cookie
 */
export function getCookie(cname) {
  const cName = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  /* eslint-disable-next-line no-plusplus */
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cName) === 0) {
      return c.substring(cName.length, c.length);
    }
  }
  return "";
}

export function prependSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}
