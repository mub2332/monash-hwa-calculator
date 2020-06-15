chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'load') {
    var units = [];
    var values = [];
    var index = 0;

    $(
      "table[cellspacing='0'][cellpadding='3'][border='1'][width='660'] td[align='center']"
    ).each(function () {
      // Incomplete units
      if ($(this).attr('colspan') === '2') {
        values.push(0);
        index = index + 2;
        return;
      }

      var value = $(this).text();
      var isInt = parseFloat(value) == parseInt(value);

      if (value === '-') {
        values.push(0);
        index++;
        return;
      }

      if (isInt && !(index === 0 || index % 4 === 0)) {
        values.push(value);
      }

      index++;
    });

    $(
      "table[cellspacing='0'][cellpadding='3'][border='1'][width='660'] td"
    ).each(function () {
      if ($(this).text().length === 7) {
        units.push($(this).text());
      }
    });
    units.splice(0, 1);

    sendResponse({ values, units });
  }
});
