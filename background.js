// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              urlContains: 'https://my.monash.edu/wes/exam/results/',
            },
          }),
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});