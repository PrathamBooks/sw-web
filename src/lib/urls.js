const virtualLinkElement = function(url) {
  const link = document.createElement('a');
  link.setAttribute('href', url);

  return {
    hostname: link.hostname,
    protocol: link.protocol,
    pathname: link.pathname,
  }
};

export const getHostname = (url) => virtualLinkElement(url).hostname;
export const getProtocol = (url) => virtualLinkElement(url).protocol;
export const getPathname = (url) => virtualLinkElement(url).pathname;
