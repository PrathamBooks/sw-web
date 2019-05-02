export const setupLoggly = logglyKey => {
  const logglyScriptElt = document.createElement('script');
  logglyScriptElt.type = 'text/javascript';
  logglyScriptElt.src = '//cloudfront.loggly.com/js/loggly.tracker-2.1.min.js';
  logglyScriptElt.async = true;
  var firstScriptElt = document.getElementsByTagName('script')[0];
  firstScriptElt.parentNode.insertBefore(logglyScriptElt, firstScriptElt);

  firstScriptElt.onload = () => {
    window._LTracker = window._LTracker || [];
    window._LTracker.push({
      'logglyKey': logglyKey,
      'sendConsoleErrors': true,
      'tag': 'loggly-jslogger'
    });
  };
};
