let chart; // Declare chart variable in a global scope
let chart2; // Declare chart2 variable in a broader scope
let chart3;
let chart4;
let oldDataSetsGC = []; // Array to store old glucose datasets
let showOldDataGC = false; // Flag to toggle old glucose data view
let oldDataSetsBP = []; // Array to store old blood pressure datasets
let showOldDataBP = false; // Flag to toggle old blood pressure data view
let oldDataSetsSLP = []; // Array to store old blood pressure datasets
let showOldDataSLP = false; // Flag to toggle old blood pressure data view
let oldDataSetsSTR = []; // Array to store old blood pressure datasets
let showOldDataSTR = false; // Flag to toggle old blood pressure data view
let oldDataSetsTEMP = []; // Array to store old blood pressure datasets
let showOldDataTEMP = false; // Flag to toggle old blood pressure data view
let oldDataSetsHRT = []; // Array to store old blood pressure datasets
let showOldDataHRT = false; // Flag to toggle old blood pressure data view
let oldDataSetsOXY = []; // Array to store old blood pressure datasets
let showOldDataOXY = false; // Flag to toggle old blood pressure data view
let xValuesGlucose = [];
let yValuesGlucose = [];
let xValuesSleep = [];
let yValuesSleep = [];
let xValuesStress = [];
let yValuesStress = [];
let xValuesTemp = [];
let yValuesTemp = [];
let xValuesOxygen = [];
let yValuesOxygen = [];
let xValuesHeart = [];
let yValuesHeart = [];
let xValuesBP = [];
let yValuesSystolic = [];
let yValuesDiastolic = [];
let yValuesAverage = [];
let canvasCreated = false; // Flag to track whether the chart canvas has been created
let stopGenerateLoad = false;

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('keydown', function (event) {
    console.log("Key pressed:", event.key);

    if (event.key === 'v') {
      showOldDataBP = !showOldDataBP;
      showOldDataGC = false;
      showOldDataSLP = false;
      showOldDataSTR = false;

      if (showOldDataBP) {
        destroyChart();
        showOldDataSetsBP();
      } else {
        if (canvasCreated) {
          destroyChart();
          generateGraphBP();
        }
      }
    } else if (event.key === 'b') {
      showOldDataGC = !showOldDataGC;
      showOldDataBP = false;
      showOldDataSLP = false;
      showOldDataSTR = false;

      if (showOldDataGC) {
        destroyChart();
        showOldDataSetsGC();
      } else {
        if (canvasCreated) {
          destroyChart();
          generateGraphGlucose();
        }
      }
    }
    else if (event.key === 'n') {
      showOldDataSLP = !showOldDataSLP;
      showOldDataBP = false;
      showOldDataGC = false;
      showOldDataSTR = false;

      if (showOldDataSLP) {
        destroyChart();
        showOldDataSetsSLP();
      } else {
        if (canvasCreated) {
          destroyChart();
          generateGraphSleep();
        }
      }
    }
    else if (event.key === 'm') {
      showOldDataSTR = !showOldDataSTR;
      showOldDataBP = false;
      showOldDataGC = false;
      showOldDataSLP = false;

      if (showOldDataSLP) {
        destroyChart();
        showOldDataSetsSLP();
      } else {
        if (canvasCreated) {
          destroyChart();
          generateGraphSleep();
        }
      }
    }
  });
});

function destroyChart() {
  if (chart) {
    chart.destroy();
    canvasCreated = false;
  }
  if (chart2) {
    chart2.destroy();
    canvasCreated = false;
  }
  if (chart3) {
    chart3.destroy();
    canvasCreated = false;
  }
  if (chart4) {
    chart4.destroy();
    canvasCreated = false;
  }
}

function generateLoad() {
  if (stopGenerateLoad) {
    return;
  }
  setTimeout(generateLoad, 2000);
  generateDataBP();
  generateDataGLC()
  generateDataSLP();
  generateDataSTR();
  generateDataTEMP();
  generateDataOXY();
  generateDataHRT();
}

function mapToGradientColor(value, minValue, maxValue) {
  const midValue = (minValue + maxValue) / 2;

  if (value <= midValue) {
    const normalizedValue = (value - minValue) / (midValue - minValue);
    const r = Math.round((255 * normalizedValue) + 65);
    const g = Math.round(255 - 255 * normalizedValue);
    const b = Math.round(50);
    return `rgba(${r},${g},${b},1)`;
  } else {
    const normalizedValue = (value - midValue) / (maxValue - midValue);
    const r = Math.round(255);
    const g = Math.round((255 * normalizedValue) - 65);
    const b = Math.round(50);
    return `rgba(${r},${g},${b},1)`;
  }
}

function mapToGradientColorInverted(value, minValue, maxValue) {
  const midValue = (minValue + maxValue) / 2;

  if (value >= midValue) {
    const normalizedValue = (value - midValue) / (maxValue - midValue);
    const r = Math.round(255 * (1 - normalizedValue)) + 65;
    const g = Math.round(255 - 255 * (1 - normalizedValue));
    const b = Math.round(50);
    return `rgba(${r},${g},${b},1)`;
  } else {
    const normalizedValue = (value - minValue) / (midValue - minValue);
    const r = Math.round(255);
    const g = Math.round((255 * normalizedValue) - 65);
    const b = Math.round(50);
    return `rgba(${r},${g},${b},1)`;
  }
}

function showOldDataSetsGC() {
  destroyChart();

  if (oldDataSetsGC.length === 0) {
    console.error("No old datasets available.");
    return;
  }

  // Calculate the average values for each set of 24 data points
  const averagedSets = [];
  for (let i = 0; i < oldDataSetsGC.length; i += 24) {
    const subset = oldDataSetsGC.slice(i, i + 24);
    const average = subset.reduce((sum, set) => {
      return sum + set.glucose.reduce((setSum, value) => setSum + parseInt(value), 0);
    }, 0) / (subset.length * 24);

    // Assuming you have a gradient color stored directly in each subset
    const gradientColor = subset[0].gradientColor;

    averagedSets.push({
      average: Math.round(average),
      gradientColor: gradientColor,
    });
  }

  const datasets = averagedSets.map(set => ({
    label: "Average Glucose Level",
    borderColor: set.gradientColor,
    backgroundColor: set.gradientColor + '80', // Adjust alpha for fill color
    fill: true,
    lineTension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 5,
    pointStyle: 'circle',
    data: [set.average],
  }));

  chart2 = new Chart("myChart", {
    type: "bar",
    data: {
      labels: Array.from({ length: averagedSets.length }, (_, i) => i + 1),
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          fontSize: 24,
          max: 7,
        },
        y: {
          type: 'linear',
          position: 'left',
          fontSize: 24,
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
      },
    },
  });

  // Set canvasCreated to true after creating the chart
  canvasCreated = true;
}

function showOldDataSetsSLP() {
  destroyChart();

  if (oldDataSetsSLP.length === 0) {
    console.error("No old datasets available.");
    return;
  }

  // Calculate the average values for each set of 24 data points
  const averagedSets = [];
  for (let i = 0; i < oldDataSetsSLP.length; i += 24) {
    const subset = oldDataSetsSLP.slice(i, i + 24);
    const average = subset.reduce((sum, set) => {
      return sum + set.sleep.reduce((setSum, value) => setSum + parseInt(value), 0);
    }, 0) / (subset.length * 24);

    // Assuming you have a gradient color stored directly in each subset
    const gradientColor = subset[0].gradientColor;

    averagedSets.push({
      average: Math.round(average),
      gradientColor: gradientColor,
    });
  }

  const datasets = averagedSets.map(set => ({
    label: "Average Sleep Level",
    borderColor: set.gradientColor,
    backgroundColor: set.gradientColor + '80', // Adjust alpha for fill color
    fill: true,
    lineTension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 5,
    pointStyle: 'circle',
    data: [set.average],
  }));

  chart2 = new Chart("myChart", {
    type: "bar",
    data: {
      labels: Array.from({ length: averagedSets.length }, (_, i) => i + 1),
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          fontSize: 24,
          max: 7,
        },
        y: {
          type: 'linear',
          position: 'left',
          fontSize: 24,
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
      },
    },
  });

  // Set canvasCreated to true after creating the chart
  canvasCreated = true;
}

function showOldDataSetsSTR() {
  destroyChart();

  if (oldDataSetsSTR.length === 0) {
    console.error("No old datasets available.");
    return;
  }

  // Calculate the average values for each set of 24 data points
  const averagedSets = [];
  for (let i = 0; i < oldDataSetsSTR.length; i += 24) {
    const subset = oldDataSetsSTR.slice(i, i + 24);
    const average = subset.reduce((sum, set) => {
      return sum + set.stress.reduce((setSum, value) => setSum + parseInt(value), 0);
    }, 0) / (subset.length * 24);

    // Assuming you have a gradient color stored directly in each subset
    const gradientColor = subset[0].gradientColor;

    averagedSets.push({
      average: Math.round(average),
      gradientColor: gradientColor,
    });
  }

  const datasets = averagedSets.map(set => ({
    label: "Average Stress Level",
    borderColor: set.gradientColor,
    backgroundColor: set.gradientColor + '80', // Adjust alpha for fill color
    fill: true,
    lineTension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 5,
    pointStyle: 'circle',
    data: [set.average],
  }));

  chart2 = new Chart("myChart", {
    type: "bar",
    data: {
      labels: Array.from({ length: averagedSets.length }, (_, i) => i + 1),
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          fontSize: 24,
          max: 7,
        },
        y: {
          type: 'linear',
          position: 'left',
          fontSize: 24,
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
      },
    },
  });

  // Set canvasCreated to true after creating the chart
  canvasCreated = true;
}

function showOldDataSetsBP() {
  destroyChart();

  if (oldDataSetsBP.length === 0) {
    console.error("No old datasets available.");
    return;
  }

  const averagedSets = [];
  for (let i = 0; i < oldDataSetsBP.length; i += 24) {
    const subset = oldDataSetsBP.slice(i, i + 24);
    const average = subset.reduce((sum, set) => {
      return sum + set.average.reduce((setSum, value) => setSum + parseInt(value), 0);
    }, 0) / (subset.length * 24);

    const colors = subset[0].colors; // Retrieve colors for the subset
    averagedSets.push({
      average: Math.round(average),
      gradientColor: colors[0], // Assuming gradientColor is stored in the first color of the subset
    });
  }

  const datasets = averagedSets.map(set => ({
    label: "Average BP",
    borderColor: set.gradientColor,
    backgroundColor: set.gradientColor + '80',
    fill: true,
    lineTension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 5,
    pointStyle: 'circle',
    data: [set.average],
  }));

  // Display only the average bar graph
  chart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: ["Average BP"],
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          fontSize: 24,
          max: 7,
        },
        y: {
          type: 'linear',
          position: 'left',
          fontSize: 24,
          beginAtZero: true,
          stepSize: 1,
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
      },
    },
  });

  // Set canvasCreated to true after creating the chart
  canvasCreated = true;
}

function generateGraphBP() {
  stopGenerateLoad = true;
  console.log('generateGraphBP function called');
  destroyChart();
  xValuesBP = [];
  yValuesSystolic = [];
  yValuesDiastolic = [];
  yValuesAverage = [];

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
  } else {
    console.error("Canvas container not found");
    return;
  }

  chart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValuesBP,
      datasets: [
        {
          label: "Systolic BP",
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(0,0,0,0.1)",
          fill: true,
          lineTension: 0.25,
          cubicInterpolationMode: 'monotone',
          borderWidth: 2.5,
          pointStyle: 'circle',
          data: [],
        },
        {
          label: "Diastolic BP",
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(0,0,0,0.1)",
          fill: true,
          lineTension: 0.25,
          cubicInterpolationMode: 'monotone',
          borderWidth: 2.5,
          pointStyle: 'circle',
          data: [],
        },
        {
          label: "Average BP",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(0,0,0,0.1)",
          fill: true,
          lineTension: 0.35,
          cubicInterpolationMode: 'monotone',
          borderWidth: 20,
          pointStyle: 'circle',
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: {
        display: false,
        boxWidth: 5, boxHeight: 5, borderWidth: 1, fontSize: 24,
      },
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          max: 24,
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Time (Hours) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: {
            beginAtZero: true,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            position: 'top',
            text: 'Mean Pressure (mm of Hg) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: false,
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'nearest',
              scaleID: 'y',
              value: 0,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              label: {
                content: 'Systolic: 0',
                enabled: true,
              },
            },
            {
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y',
              value: 0,
              borderColor: 'rgba(255, 0, 0, 0.5)',
              borderWidth: 1,
              label: {
                content: 'Diastolic: 0',
                enabled: true,
              },
            },
          ],
        },
      },
    },
  });

  canvasCreated = true;

  function generateData() {
    if (!chart) {
      console.error("Chart is not initialized.");
      return;
    }

    const spdp = Math.random();
    const systolicBP = Math.floor((spdp * 60) + 90);
    const diastolicBP = Math.floor((spdp * 40) + 60);

    yValuesSystolic.push(systolicBP);
    yValuesDiastolic.push(diastolicBP);
    xValuesBP.push(xValuesBP.length + 1);

    const averageBP = Math.floor(diastolicBP + ((1 / 3) * (systolicBP - diastolicBP)));
    yValuesAverage.push(averageBP);

    if (xValuesBP.length > 24) {
      yValuesSystolic.shift();
      yValuesDiastolic.shift();
      yValuesAverage.shift();
    }

    // Save old dataset
    if (!showOldDataBP) {
      oldDataSetsBP.push({
        x: [...xValuesBP],
        systolic: [...yValuesSystolic],
        diastolic: [...yValuesDiastolic],
        average: [...yValuesAverage],
        colors: generateColorsBP(yValuesSystolic, 60, 150),
      });
    }

    // Initialize chart datasets if not already defined
    if (!chart.data.datasets) {
      chart.data.datasets = [
        { data: [], borderColor: '', borderWidth: 2.5, pointRadius: 0 },
        { data: [], borderColor: '', borderWidth: 2.5, pointRadius: 0 },
        { data: [], borderColor: '', borderWidth: 2.5, pointRadius: 0 },
      ];
    }

    // Ensure chart datasets[1] and datasets[2] exist
    if (!chart.data.datasets[1]) {
      chart.data.datasets[1] = { data: [], borderColor: '', borderWidth: 2.5, pointRadius: 0 };
    }

    if (!chart.data.datasets[2]) {
      chart.data.datasets[2] = { data: [], borderColor: '', borderWidth: 2.5, pointRadius: 0 };
    }

    // Apply color gradient locally
    const gradientColorSystolic = mapToGradientColor(systolicBP, 100, 210);
    const gradientColorDiastolic = mapToGradientColor(diastolicBP, 60, 150);
    const gradientColorAverage = mapToGradientColor(averageBP, 60, 150);

    chart.data.datasets[0].data = yValuesSystolic.map((y, index) => ({
      x: xValuesBP[index],
      y,
      color: gradientColorSystolic,
    }));
    chart.data.datasets[1].data = yValuesDiastolic.map((y, index) => ({
      x: xValuesBP[index],
      y,
      color: gradientColorDiastolic,
    }));
    chart.data.datasets[2].data = yValuesAverage.map((y, index) => ({
      x: xValuesBP[index],
      y,
      color: gradientColorAverage,
    }));

    chart.data.datasets[0].borderColor = gradientColorSystolic;
    chart.data.datasets[1].borderColor = gradientColorDiastolic;
    chart.data.datasets[2].borderColor = gradientColorAverage;

    // Add annotation for the latest values
    const annotationPlugin = chart.options.plugins.annotation;

    if (annotationPlugin && annotationPlugin.annotations) {
      annotationPlugin.annotations[0].value = yValuesSystolic[yValuesSystolic.length - 1];
      annotationPlugin.annotations[1].value = yValuesDiastolic[yValuesDiastolic.length - 1];
    }

    chart.update();
    setTimeout(generateData, 2000);
    updateBloodPressureValues();
  }

  // Function to generate colors for old datasets
  function generateColorsBP(data, minValue, maxValue) {
    return data.map(value => mapToGradientColor(value, minValue, maxValue));
  }

  generateData();
}

function generateDataBP() {
  const spdp = Math.random();
  const systolicBP = Math.floor((spdp * 60) + 90);
  const diastolicBP = Math.floor((spdp * 40) + 60);

  yValuesSystolic.push(systolicBP);
  yValuesDiastolic.push(diastolicBP);
  xValuesBP.push(xValuesBP.length + 1);

  const averageBP = Math.floor(diastolicBP + ((1 / 3) * (systolicBP - diastolicBP)));
  yValuesAverage.push(averageBP);

  if (xValuesBP.length > 24) {
    yValuesSystolic.shift();
    yValuesDiastolic.shift();
    yValuesAverage.shift();
  }

  // Save old dataset
  if (!showOldDataBP) {
    oldDataSetsBP.push({
      x: [...xValuesBP],
      systolic: [...yValuesSystolic],
      diastolic: [...yValuesDiastolic],
      average: [...yValuesAverage],
      colors: generateColors(yValuesAverage, 60, 150),
    });
  }

  // Apply color gradient locally
  const gradientColorSystolic = mapToGradientColor(systolicBP, 100, 210);
  const gradientColorDiastolic = mapToGradientColor(diastolicBP, 60, 150);
  const gradientColorAverage = mapToGradientColor(averageBP, 60, 150);

  const colorData = {
    systolic: gradientColorSystolic,
    diastolic: gradientColorDiastolic,
    average: gradientColorAverage,
  };

  // Call the function to update blood pressure values with the color data
  updateBloodPressureValues(colorData);
}

function generateGraphGlucose() {
  stopGenerateLoad = true;
  console.log('generateGraphGlucose function called');
  destroyChart();
  xValuesGlucose = [];
  yValuesGlucose = [];

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
  } else {
    console.error("Canvas container not found");
    return;
  }

  chart2 = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValuesGlucose,
      datasets: [
        {
          label: "Glucose Level",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(0,0,0,0.2)",
          fill: true,
          lineTension: 0.35,
          cubicInterpolationMode: 'monotone',
          borderWidth: 20,
          pointStyle: 'circle',
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          max: 24,
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Time (Hours) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: {
            beginAtZero: true,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Blood Saturation (mg/dL) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'nearest',
              scaleID: 'y',
              value: 0,
              borderColor: 'rgba(255, 0, 0, 0.5)',
              borderWidth: 1,
              label: {
                content: 'Glucose: 0',
                enabled: true,
              },
            },
          ],
        },
      },
    },
  });

  canvasCreated = true;

  function generateData() {
    const glc = Math.random();
    let glucoseValue;

    if (glc <= 0.75) {
      glucoseValue = Math.floor(((glc * Math.random() * 200) + 110) / 2);
    }
    else {
      glucoseValue = Math.floor(((glc * Math.random() * 100) + 90) / 2);
    }

    yValuesGlucose.push(glucoseValue);
    xValuesGlucose.push(xValuesGlucose.length + 1);

    if (xValuesGlucose.length > 24) {
      yValuesGlucose.shift();
    }

    // Save old dataset with color information
    if (!showOldDataGC) {
      const gradientColorGlucose = mapToGradientColor(glucoseValue, 80, 200);
      oldDataSetsGC.push({
        x: [...xValuesGlucose],
        glucose: [...yValuesGlucose],
        gradientColor: gradientColorGlucose,
      });
    }

    // Apply color gradient locally
    const gradientColorGlucose = mapToGradientColor(glucoseValue, 80, 200);

    chart2.data.datasets[0].data = yValuesGlucose.map((y, index) => ({
      x: xValuesGlucose[index],
      y,
      radius: 25,
      backgroundColor: gradientColorGlucose,  // Use backgroundColor instead of borderColor
    }));

    chart2.data.datasets[0].borderColor = gradientColorGlucose;
    // Add annotation for the latest values
    const annotationPlugin = chart2.options.plugins.annotation;

    if (annotationPlugin && annotationPlugin.annotations) {
      annotationPlugin.annotations[0].value = yValuesGlucose[yValuesGlucose.length - 1];
    }

    chart2.update();
    setTimeout(generateData, 2000);
    updateGlucoseValues();
  }

  generateData();

}

function generateDataGLC() {
  const glc = Math.random();
  let glucoseValue;

  if (glc <= 0.75) {
    glucoseValue = Math.floor(((glc * Math.random() * 200) + 110) / 2);
  } else {
    glucoseValue = Math.floor(((glc * Math.random() * 100) + 90) / 2);
  }

  yValuesGlucose.push(glucoseValue);
  xValuesGlucose.push(xValuesGlucose.length + 1);

  if (xValuesGlucose.length > 24) {
    yValuesGlucose.shift();
  }

  // Save old dataset with color information
  if (!showOldDataGC) {
    const gradientColorGlucose = mapToGradientColor(glucoseValue, 80, 200);
    oldDataSetsGC.push({
      x: [...xValuesGlucose],
      glucose: [...yValuesGlucose],
      gradientColor: gradientColorGlucose,
    });
  }

  // Apply color gradient locally
  const gradientColorGlucose = mapToGradientColor(glucoseValue, 80, 200);

  const colorData = {
    glucose: gradientColorGlucose,
  };

  // Call the function to update glucose values with the color data
  updateGlucoseValues(colorData);

}

function generateGraphSleep() {
  stopGenerateLoad = true;
  console.log('generateGraphSleep function called');
  destroyChart();
  xValuesSleep = [];
  yValuesSleep = [];

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
  } else {
    console.error("Canvas container not found");
    return;
  }

  chart3 = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValuesSleep,
      datasets: [
        {
          label: "Sleep Level",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(0,0,0,0.2)",
          fill: true,
          lineTension: 0.35,
          cubicInterpolationMode: 'monotone',
          borderWidth: 20,
          pointStyle: 'circle',
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          max: 24,
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Time (Hours) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: {
            beginAtZero: true,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Sleep Score (Points) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'nearest',
              scaleID: 'y',
              value: 0,
              borderColor: 'rgba(255, 0, 0, 0.5)',
              borderWidth: 1,
              label: {
                content: 'Sleep: 0',
                enabled: true,
              },
            },
          ],
        },
      },
    },
  });

  canvasCreated = true;

  function generateData() {

    const slp = Math.random();
    let sleepValue;

    if (slp < 0.95) {
      // 90% of the time, get values around 90
      sleepValue = Math.floor((Math.random() * 20) + 80);
    } else {
      // 10% of the time, allow values in the lower range
      sleepValue = Math.floor((Math.random() * 10) + 50);
    }


    yValuesSleep.push(sleepValue);
    xValuesSleep.push(xValuesSleep.length + 1);

    if (xValuesSleep.length > 24) {
      yValuesSleep.shift();
    }

    // Save old dataset with color information
    if (!showOldDataSLP) {
      const gradientColorSleep = mapToGradientColorInverted(sleepValue, 0, 100);
      oldDataSetsSLP.push({
        x: [...xValuesSleep],
        sleep: [...yValuesSleep],
        gradientColor: gradientColorSleep,
      });
    }

    // Apply color gradient locally
    const gradientColorSleep = mapToGradientColorInverted(sleepValue, 0, 100);

    chart3.data.datasets[0].data = yValuesSleep.map((y, index) => ({
      x: xValuesSleep[index],
      y,
      radius: 25,
      backgroundColor: gradientColorSleep,  // Use backgroundColor instead of borderColor
    }));

    chart3.data.datasets[0].borderColor = gradientColorSleep;
    // Add annotation for the latest values
    const annotationPlugin = chart3.options.plugins.annotation;

    if (annotationPlugin && annotationPlugin.annotations) {
      annotationPlugin.annotations[0].value = yValuesSleep[yValuesSleep.length - 1];
    }

    chart3.update();
    setTimeout(generateData, 2000);
    updateSleepValues();
  }

  generateData();
}

function generateDataSLP() {
  const slp = Math.random();
  let sleepValue;

  if (slp < 0.95) {
    // 90% of the time, get values around 90
    sleepValue = Math.floor((Math.random() * 20) + 80);
  } else {
    // 10% of the time, allow values in the lower range
    sleepValue = Math.floor((Math.random() * 10) + 50);
  }

  yValuesSleep.push(sleepValue);
  xValuesSleep.push(xValuesSleep.length + 1);

  if (xValuesSleep.length > 24) {
    yValuesSleep.shift();
  }

  // Save old dataset with color information
  if (!showOldDataSLP) {
    const gradientColorSleep = mapToGradientColorInverted(sleepValue, 80, 200);
    oldDataSetsSLP.push({
      x: [...xValuesSleep],
      sleep: [...yValuesSleep],
      gradientColor: gradientColorSleep,
    });
  }

  // Apply color gradient locally
  const gradientColorSleep = mapToGradientColorInverted(sleepValue, 0, 100);

  const colorData = {
    sleep: gradientColorSleep,
  };

  // Call the function to update glucose values with the color data
  updateSleepValues(colorData);

}

function generateGraphStress() {
  stopGenerateLoad = true;
  console.log('generateGraphStress function called');
  destroyChart();
  xValuesStress = [];
  yValuesStress = [];

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
  } else {
    console.error("Canvas container not found");
    return;
  }

  chart4 = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValuesStress,
      datasets: [
        {
          label: "Stress Level",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(0,0,0,0.2)",
          fill: true,
          lineTension: 0.35,
          cubicInterpolationMode: 'monotone',
          borderWidth: 20,
          pointStyle: 'circle',
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: true,
      legend: false,
      elements: {
        point: {
          radius: 3,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          max: 24,
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Time (Hours) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: {
            beginAtZero: true,
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            display: true,
            text: 'Stress Score (Points) ->',
            font: {
              size: 24,
              family: 'Helvetica, Arial, sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: false,
        elements: {
          point: {
            radius: 3,
          },
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'nearest',
              scaleID: 'y',
              value: 0,
              borderColor: 'rgba(255, 0, 0, 0.5)',
              borderWidth: 1,
              label: {
                content: 'Stress: 0',
                enabled: true,
              },
            },
          ],
        },
      },
    },
  });

  canvasCreated = true;

  function generateData() {

    const strs = Math.random();
    let stressValue;

    if (strs < 0.25) {
      stressValue = Math.floor((Math.random() * 60) + 40);
    } else {
      stressValue = Math.floor((Math.random() * 20) + 20);
    }


    yValuesStress.push(stressValue);
    xValuesStress.push(xValuesStress.length + 1);

    if (xValuesStress.length > 24) {
      yValuesStress.shift();
    }

    // Save old dataset with color information
    if (!showOldDataSTR) {
      const gradientColorStress = mapToGradientColor(stressValue, 40, 100);
      oldDataSetsSTR.push({
        x: [...xValuesStress],
        stress: [...yValuesStress],
        gradientColor: gradientColorStress,
      });
    }

    // Apply color gradient locally
    const gradientColorStress = mapToGradientColor(stressValue, 40, 100);

    chart4.data.datasets[0].data = yValuesStress.map((y, index) => ({
      x: xValuesStress[index],
      y,
      radius: 25,
      backgroundColor: gradientColorStress,  // Use backgroundColor instead of borderColor
    }));

    chart4.data.datasets[0].borderColor = gradientColorStress;
    // Add annotation for the latest values
    const annotationPlugin = chart4.options.plugins.annotation;

    if (annotationPlugin && annotationPlugin.annotations) {
      annotationPlugin.annotations[0].value = yValuesStress[yValuesStress.length - 1];
    }

    chart4.update();
    setTimeout(generateData, 2000);
    updateStressValues();
  }

  generateData();
}

function generateDataSTR() {

  const strs = Math.random();
  let stressValue;

  if (strs < 0.25) {
    stressValue = Math.floor((Math.random() * 50) + 50);
  } else {
    stressValue = Math.floor((Math.random() * 20) + 30);
  }

  yValuesStress.push(stressValue);
  xValuesStress.push(xValuesStress.length + 1);

  if (xValuesStress.length > 24) {
    yValuesStress.shift();
  }

  // Save old dataset with color information
  if (!showOldDataSTR) {
    const gradientColorStress = mapToGradientColorInverted(stressValue, 40, 100);
    oldDataSetsSTR.push({
      x: [...xValuesStress],
      stress: [...yValuesStress],
      gradientColor: gradientColorStress,
    });
  }

  // Apply color gradient locally
  const gradientColorStress = mapToGradientColorInverted(stressValue, 40, 100);

  const colorData = {
    stress: gradientColorStress,
  };

  // Call the function to update glucose values with the color data
  updateStressValues(colorData);

}

function generateDataTEMP() {

  const tmp = Math.random();
  let tempValue;

  if (tmp < 0.025) {
    tempValue = Math.round((Math.random() * 50)) / 10 + 99;
  } else {
    tempValue = Math.round((Math.random() * 20)) / 10 + 97;
  }

  yValuesTemp.push(tempValue);
  xValuesTemp.push(xValuesTemp.length + 1);

  if (xValuesTemp.length > 24) {
    yValuesTemp.shift();
  }

  // Save old dataset with color information
  if (!showOldDataTEMP) {
    const gradientColorTemp = mapToGradientColorInverted(tempValue, 97, 104);
    oldDataSetsTEMP.push({
      x: [...xValuesTemp],
      temp: [...yValuesTemp],
      gradientColor: gradientColorTemp,
    });
  }

  // Apply color gradient locally
  const gradientColorTemp = mapToGradientColorInverted(tempValue, 97, 104);

  const colorData = {
    temp: gradientColorTemp,
  };

  // Call the function to update glucose values with the color data
  updateTempValues(colorData);

}

function generateDataOXY() {

  const oxy = Math.random();
  let oxygenValue;

  if (oxy < 0.025) {
    oxygenValue = Math.floor(100 - (Math.random() * 10));
  } else {
    oxygenValue = Math.floor((Math.random() * 5) + 95);
  }

  yValuesOxygen.push(oxygenValue);
  xValuesOxygen.push(xValuesOxygen.length + 1);

  if (xValuesOxygen.length > 24) {
    yValuesOxygen.shift();
  }

  // Save old dataset with color information
  if (!showOldDataOXY) {
    const gradientColorOxygen = mapToGradientColorInverted(oxygenValue, 90, 100);
    oldDataSetsOXY.push({
      x: [...xValuesOxygen],
      oxygen: [...yValuesOxygen],
      gradientColor: gradientColorOxygen,
    });
  }

  // Apply color gradient locally
  const gradientColorOxygen = mapToGradientColorInverted(oxygenValue, 90, 100);

  const colorData = {
    oxygen: gradientColorOxygen,
  };

  // Call the function to update glucose values with the color data
  updateOxygenValues(colorData);

}

function generateDataHRT() {

  const hrt = Math.random();
  let heartValue;

  if (hrt < 0.025) {
    heartValue = Math.floor((Math.random() * 30) + 90);
  } else {
    heartValue = Math.floor((Math.random() * 40) + 50);
  }

  yValuesHeart.push(heartValue);
  xValuesHeart.push(xValuesHeart.length + 1);

  if (xValuesHeart.length > 24) {
    yValuesHeart.shift();
  }

  // Save old dataset with color information
  if (!showOldDataHRT) {
    const gradientColorHeart = mapToGradientColor(heartValue, 50, 120);
    oldDataSetsHRT.push({
      x: [...xValuesHeart],
      heart: [...yValuesHeart],
      gradientColor: gradientColorHeart,
    });
  }

  // Apply color gradient locally
  const gradientColorHeart = mapToGradientColor(heartValue, 50, 120);

  const colorData = {
    heart: gradientColorHeart,
  };

  // Call the function to update glucose values with the color data
  updateHeartValues(colorData);

}

//

function updateBloodPressureValues() {
  const latestSystolicValue = yValuesSystolic[yValuesSystolic.length - 1];
  const latestDiastolicValue = yValuesDiastolic[yValuesDiastolic.length - 1];
  const latestAverageBPValue = yValuesAverage[yValuesAverage.length - 1];

  // Update systolic value
  const systolicValueElement = document.getElementById('BPValue');
  const BPIconValueElement = document.getElementById('BPIcon');
  const BPTextValueElement = document.getElementById('BPText');
  const BPColourValueElement = document.getElementById('BPColour');

  systolicValueElement.innerHTML = `${latestSystolicValue} / ${latestDiastolicValue}`;
  const gradientColorAverage = mapToGradientColor(latestAverageBPValue, 90, 180);
  systolicValueElement.style.color = gradientColorAverage;
  BPIconValueElement.style.background = gradientColorAverage;
  BPTextValueElement.style.color = gradientColorAverage;
  BPColourValueElement.style.color = gradientColorAverage;
}

function updateGlucoseValues() {
  const latestGlucoseValue = yValuesGlucose[yValuesGlucose.length - 1];

  const glucoseValueElement = document.getElementById('glucoseValue');
  const GCIconValueElement = document.getElementById('GCIconValue');
  const GCTextValueElement = document.getElementById('GCTextValue');
  const GCColourValueElement = document.getElementById('GCColourValue');

  if (glucoseValueElement) {
    glucoseValueElement.innerHTML = `${latestGlucoseValue}`;
    const gradientColorGlucose = mapToGradientColor(latestGlucoseValue, 80, 200);
    glucoseValueElement.style.color = gradientColorGlucose;
    GCIconValueElement.style.background = gradientColorGlucose;
    GCTextValueElement.style.color = gradientColorGlucose;
    GCColourValueElement.style.color = gradientColorGlucose;
  }
}

function updateSleepValues() {
  const latestSleepValue = yValuesSleep[yValuesSleep.length - 1];

  const sleepValueElement = document.getElementById('sleepValue');
  const SLPIconValueElement = document.getElementById('SLPIconValue');
  const SLPTextValueElement = document.getElementById('SLPTextValue');
  const SLPColourValueElement = document.getElementById('SLPColourValue');

  if (sleepValueElement) {
    sleepValueElement.innerHTML = `${latestSleepValue}`;
    const gradientColorSleep = mapToGradientColorInverted(latestSleepValue, 0, 100);
    sleepValueElement.style.color = gradientColorSleep;
    SLPIconValueElement.style.background = gradientColorSleep;
    SLPTextValueElement.style.color = gradientColorSleep;
    SLPColourValueElement.style.color = gradientColorSleep;
  }
}

function updateStressValues() {
  const latestStressValue = yValuesStress[yValuesStress.length - 1];

  const stressValueElement = document.getElementById('stressValue');
  const STRIconValueElement = document.getElementById('STRIconValue');
  const STRTextValueElement = document.getElementById('STRTextValue');
  const STRColourValueElement = document.getElementById('STRColourValue');

  if (stressValueElement) {
    stressValueElement.innerHTML = `${latestStressValue}`;
    const gradientColorStress = mapToGradientColor(latestStressValue, 40, 100);
    stressValueElement.style.color = gradientColorStress;
    STRIconValueElement.style.background = gradientColorStress;
    STRTextValueElement.style.color = gradientColorStress;
    STRColourValueElement.style.color = gradientColorStress;
  }
}

function updateTempValues() {
  const latestTempValue = yValuesTemp[yValuesTemp.length - 1];

  const tempValueElement = document.getElementById('tempValue');
  const TMPIconValueElement = document.getElementById('TMPIconValue');
  const TMPTextValueElement = document.getElementById('TMPTextValue');
  const TMPColourValueElement = document.getElementById('TMPColourValue');

  if (tempValueElement) {
    tempValueElement.innerHTML = `${latestTempValue}`;
    const gradientColorStress = mapToGradientColor(latestTempValue, 97.8, 104);
    tempValueElement.style.color = gradientColorStress;
    TMPIconValueElement.style.background = gradientColorStress;
    TMPTextValueElement.style.color = gradientColorStress;
    TMPColourValueElement.style.color = gradientColorStress;
  }
}

function updateOxygenValues() {
  const latestOxygenValue = yValuesOxygen[yValuesOxygen.length - 1];

  const oxygenValueElement = document.getElementById('oxygenValue');
  const OXYIconValueElement = document.getElementById('OXYIconValue');
  const OXYTextValueElement = document.getElementById('OXYTextValue');
  const OXYColourValueElement = document.getElementById('OXYColourValue');
  const OXYColour2ValueElement = document.getElementById('OXYColour2Value');

  if (oxygenValueElement) {
    oxygenValueElement.innerHTML = `${latestOxygenValue}`;
    const gradientColorOxygen = mapToGradientColorInverted(latestOxygenValue, 80, 100);
    oxygenValueElement.style.color = gradientColorOxygen;
    OXYIconValueElement.style.background = gradientColorOxygen;
    OXYTextValueElement.style.color = gradientColorOxygen;
    OXYColourValueElement.style.color = gradientColorOxygen;
    OXYColour2ValueElement.style.color = gradientColorOxygen;
  }
}

function updateHeartValues() {
  const latestHeartValue = yValuesHeart[yValuesHeart.length - 1];

  const heartValueElement = document.getElementById('heartValue');
  const HRTIconValueElement = document.getElementById('HRTIconValue');
  const HRTTextValueElement = document.getElementById('HRTTextValue');
  const HRTColourValueElement = document.getElementById('HRTColourValue');

  if (heartValueElement) {
    heartValueElement.innerHTML = `${latestHeartValue}`;
    const gradientColorHeart = mapToGradientColor(latestHeartValue, 50, 130);
    heartValueElement.style.color = gradientColorHeart;
    HRTIconValueElement.style.background = gradientColorHeart;
    HRTTextValueElement.style.color = gradientColorHeart;
    HRTColourValueElement.style.color = gradientColorHeart;
  }
}

function generateColors(data, minValue, maxValue) {
  return data.map(value => mapToGradientColor(value, minValue, maxValue));
}