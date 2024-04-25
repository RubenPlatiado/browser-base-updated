import { app } from 'electron';

const REMOVE_CHROME_COMPONENT_PATTERNS = [
  /^https:\/\/accounts\.google\.com(\/|$)/,
];

const CHROME_COMPONENT_PATTERN = / Chrome\\?.([^\s]+)/g;

const COMPONENTS_TO_REMOVE = [
  / Electron\\?.([^\s]+)/g,
  ` ${app.name}/${app.getVersion()}`,
];

// Update the version numbers of Safari and WebKit here
const SAFARI_VERSION = '537.36';
const WEBKIT_VERSION = '605.1.15';

// Components to replace
const COMPONENTS_TO_REPLACE: [string | RegExp, string][] = [
  [CHROME_COMPONENT_PATTERN, ' Chrome/124.0.6367.60'],
  [/ Safari\\?.([^\s]+)/g, ` Safari/${SAFARI_VERSION}`],
  [/ AppleWebKit\\?.([^\s]+)/g, ` AppleWebKit/${WEBKIT_VERSION}`],
];

const urlMatchesPatterns = (url: string, patterns: RegExp[]) =>
  patterns.some((pattern) => url.match(pattern));

/**
 * Checks if a given URL is suitable for removal of Chrome
 * component from the user agent string.
 * @param url
 */
const shouldRemoveChromeString = (url: string) =>
  urlMatchesPatterns(url, REMOVE_CHROME_COMPONENT_PATTERNS);

export const getUserAgentForURL = (userAgent: string, url: string) => {
  let componentsToRemove = [...COMPONENTS_TO_REMOVE];

  // For accounts.google.com, we remove Chrome/*.* component
  // from the user agent, to fix compatibility issues on Google Sign In.
  // WATCH: https://developers.googleblog.com/2020/08/guidance-for-our-effort-to-block-less-secure-browser-and-apps.html
  if (shouldRemoveChromeString(url)) {
    componentsToRemove.push(CHROME_COMPONENT_PATTERN);
  }

  // Replace the components.
  [
    // Convert components to remove to pairs.
    ...componentsToRemove.map((x): [string | RegExp, string] => [x, '']),
    ...COMPONENTS_TO_REPLACE,
  ].forEach((x) => (userAgent = userAgent.replace(x[0], x[1])));

  return userAgent;
};