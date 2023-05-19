const DEFAULT_LANGUAGE = 'en';

export function getLanguageFromPathname(pn = window.location.pathname) {
    return pn.split('/')[1] || DEFAULT_LANGUAGE;
}