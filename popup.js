$(function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'load' },
      { frameId: 0 },
      function (response) {
        var units = response.units;
        var values = response.values;

        var hwa = calculateHwa(units, values);
        $('#values').text('HWA: ' + hwa.toFixed(2));
      }
    );
  });
});

function calculateHwa(units, values) {
  var weightedYearlyAverages = {};
  var weights = [];
  var hwa = 0;
  var index = 0;

  units.map((unitCode, i) => {
    var weight = parseFloat(unitCode[3]);

    if (!weights.includes(weight) && weight !== 0) weights.push(weight);

    var creditPoints = parseFloat(values[index]);
    var marks = values[index + 1];

    if (marks === 0) {
      index += 2;
      return null;
    } else {
      marks = parseFloat(marks);

      if (weightedYearlyAverages.hasOwnProperty('Grades' + weight)) {
        weightedYearlyAverages['Grades' + weight] += marks * creditPoints;
      } else {
        weightedYearlyAverages['Grades' + weight] = marks * creditPoints;
      }

      if (weightedYearlyAverages.hasOwnProperty('CreditPoints' + weight)) {
        weightedYearlyAverages['CreditPoints' + weight] += creditPoints;
      } else {
        weightedYearlyAverages['CreditPoints' + weight] = creditPoints;
      }
    }

    index += 2;
  });

  var totalOfWeights = weights.reduce((prev, curr) => prev + curr);

  weights.map((weight) => {
    var creditPoints = weightedYearlyAverages['CreditPoints' + weight];
    var grades = weightedYearlyAverages['Grades' + weight];
    var multiplicationFactor = weight / totalOfWeights;

    hwa += (grades / creditPoints) * multiplicationFactor;
  });

  return hwa;
}
