


// DRIVER FUNCTION CALLED ON FORM SUB
function uploadFile(form)
{
  // Get the canvas element and its 2D context
    const canvas = document.getElementById("output-container");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvas2 = document.getElementById("output-container2");
    const ctx2 = canvas.getContext("2d");
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    const canvase = document.getElementById("event-container");
    const ctxe = canvas.getContext("2d");
    ctxe.clearRect(0, 0, canvase.width, canvase.height);
    const canvased = document.getElementById("eventd-container");
    const ctxed = canvas.getContext("2d");
    ctxed.clearRect(0, 0, canvased.width, canvased.height);


 const formData = new FormData(form);
// console.log(form);
 var oOutput = document.getElementById("static_file_response")
 var oReq = new XMLHttpRequest();
     oReq.open("POST", "upload_static_file", true);
 oReq.onload = function(oEvent) {
     if (oReq.status == 200) {
       oOutput.innerHTML = "Finished Processing!";
      //  console.log(oReq.response)
      //  console.log(oReq.response["file"])
      //  console.log("ho")
       let data = JSON.parse(oReq.response)
//       console.log(data);
      // console.log(data["file"])

      doit(data["score"], data["timeline"]);
      analyze(data["smooth"], data["timeline"]);
      printPie(data["smooth"], data["timeline"]);
      radarSleep(data["smooth"], data["timeline"]);
//      console.log(data['time']);
      // showEvent(data["event"]);
      // showEventd(data["event"]);

      // usingAnother(data["file"]);
     } else {
       oOutput.innerHTML = "Error occurred when trying to upload your file.";
     }
     };
 oOutput.innerHTML = "Loading data and Predictions!";
 console.log("Sendings file!")
 oReq.send(formData);
}


//---------------printing smooth awake -----------
function doit(dataa, timeline){
  const dataString =dataa;
    const timeString = timeline;
// Preprocess the string to replace single quotes with double quotes
  const validJsonString = dataString.replace(/'/g, '"');
  const validJsonString2 = timeString.replace(/'/g, '"');

  // Parse the valid JSON string into an array
  const dataArray = JSON.parse(validJsonString);
  const timeArray = JSON.parse(validJsonString2);
//    console.log(timeArray);
//  console.log(dataArray);


  const canvas = document.getElementById("output-container");
  const ctx = canvas.getContext("2d");


  const chart = new Chart(ctx, {
  type: "line",
  data: {
//    labels: Array.from({ length: dataArray.length }, (_, i) => i + 1),
    labels : timeArray,
    datasets: [{ 
      label: "Probability of being Awake",
      data: dataArray,
      borderColor: "red",
      backgroundColor: "rgba(128, 0, 0, 0.2)",
      fill: true,
       pointRadius: 0 // disable for a single dataset
    }]
  },
  options: {
    responsive: true,
      maintainAspectRatio: true,
      scales: {
      x: {
          type: "linear", // Use linear scale for the x-axis (years)
          position: "bottom",
          fill : true,
          type: 'category'
      },
      y: {
          beginAtZero: true,
      },
      },
  }
});
}


// function usingAnother(dataa){
//   // Your data for the chart (replace with your own data)
//  // Your Y-axis data (replace with your own data)

// // Set the dimensions of the chart
// const width = 400;
// const height = 300;

// // Create an SVG element
// const svg = d3.select('#chart')
//     .attr('width', width)
//     .attr('height', height);

// // Create a scale for the x-axis (if needed)
// const xScale = d3.scaleLinear()
//     .domain([1, dataa.length])
//     .range([0, width]);

// // Create a scale for the y-axis (adjust the domain as needed)
// const yScale = d3.scaleLinear()
//     .domain([0, d3.max(data)])
//     .range([height, 0]);

// // Create a line generator
// const line = d3.line()
//     .x((d, i) => xScale(i + 1))
//     .y(d => yScale(d));

// // Append the line path to the SVG
// svg.append('path')
//     .datum(dataa)
//     .attr('fill', 'none')
//     .attr('stroke', 'blue') // Line color
//     .attr('stroke-width', 2) // Line width
//     .attr('d', line);

// }

//---------------printing smooth onset -----------

function analyze(dataa,timeline){
  const dataString =dataa;
    const timeString = timeline;
// Preprocess the string to replace single quotes with double quotes
  const validJsonString = dataString.replace(/'/g, '"');
  const validJsonString2 = timeString.replace(/'/g, '"');

  // Parse the valid JSON string into an array
  const dataArray = JSON.parse(validJsonString);
  const timeArray = JSON.parse(validJsonString2);
//    console.log(timeArray);
//  console.log(dataArray);


  const canvas = document.getElementById("output-container2");
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
//      labels : Array.from({ length: dataArray.length }, (_, i) => i + 1),
        labels : timeArray,

        datasets: [
            {
                label: "Onset Probability / Sleep Quality Analysis",
                data: dataArray,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                fill: true,
                 pointRadius: 0 // disable for a single dataset
            } 
        ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
      x: {
          type: "linear", // Use linear scale for the x-axis (years)
          position: "bottom",
          fill : true,
          type: 'category'
      },
      y: {
          beginAtZero: true,
      },
      },
  },
});
}


//---------------circle if awake or not -----------
function printPie(dataa, timeline){
  const dataString =dataa;
    const timeString = timeline;
// Preprocess the string to replace single quotes with double quotes
  const validJsonString = dataString.replace(/'/g, '"');
  const validJsonString2 = timeString.replace(/'/g, '"');

  // Parse the valid JSON string into an array
  const dataArray = JSON.parse(validJsonString);
  const timeArray = JSON.parse(validJsonString2);
//    console.log(timeArray);
//  console.log(dataArray);

    const resultArray = dataArray.map(value => (value > 0.5 ? 1 : 0));
//    console.log(resultArray);

  const canvas = document.getElementById("output-container3");
  const ctx3 = canvas.getContext("2d");


 const count0 = resultArray.filter(value => value === 0).length;
 const count1 = resultArray.filter(value => value === 1).length;

        // Create a Chart.js data object
        const data = {
            labels: ['Sleeping', 'WakedUp'],
            datasets: [{
                data: [count0, count1],
                backgroundColor: ['#FF5733', '#33FF57'],
            }]
        };

        // Create a Doughnut chart
        const ctx = document.getElementById('output-container3').getContext('2d');
        const myDoughnutChart = new Chart(ctx3, {
            type: 'doughnut',
            data: data
        });
}


// -------------------radar sleep-------------------------
function radarSleep(dataa,timeline){
  const dataString =dataa;
    const timeString = timeline;
// Preprocess the string to replace single quotes with double quotes
  const validJsonString = dataString.replace(/'/g, '"');
  const validJsonString2 = timeString.replace(/'/g, '"');

  // Parse the valid JSON string into an array
  const dataArray = JSON.parse(validJsonString);
  const timeArray = JSON.parse(validJsonString2);
//    console.log(timeArray);
//  console.log(dataArray);


  const canvas = document.getElementById("output-container4");
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "radar",
    data: {
//      labels : Array.from({ length: dataArray.length }, (_, i) => i + 1),
        labels : timeArray,

        datasets: [
            {
                label: "Probability of Onset",
                data: dataArray,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                fill: true,
                 pointRadius: 0 // disable for a single dataset
            }
        ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
      x: {
          type: "linear", // Use linear scale for the x-axis (years)
          position: "bottom",
          fill : true,
          type: 'category'
      },
      y: {
          beginAtZero: true,
      },
      },
  },
});
}


//--------- for event printing ------------------

function showEvent(dataa){
  const dataString =dataa;
    const validJsonString = dataString.replace(/'/g, '"');
    const dataArray = JSON.parse(validJsonString);
//    console.log(dataArray);

    const onsetArray = [];
    const awakeArray = [];

      // Iterate through the original array
    for (const item of dataArray) {
        // Check if the item is "onset" and "awake" and push 1 or 0 accordingly
        if (item === "onset") {
            onsetArray.push(1);
            awakeArray.push(0);
        } else if (item === "wakeup") {
            onsetArray.push(0);
            awakeArray.push(1);
        } else {
            onsetArray.push(0);
            awakeArray.push(0);
        }
    }
//
//    console.log("onsetArray:", onsetArray);
//    console.log("awakeArray:", awakeArray);
  
  const canvas = document.getElementById("event-container");
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels :  Array.from({ length: dataArray.length }, (_, i) => i + 1),

        datasets: [
            {
                label: "Onset Data",
                data: onsetArray,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                fill: true,
                borderWidth: 12,
            } ,
            {
              label: "Awake Data",
              data: awakeArray,
              borderColor: "red",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              fill: true,
              borderWidth: 6
          } 
        ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
      x: {
          type: "linear", // Use linear scale for the x-axis (years)
          position: "bottom",
          fill : true,
      },
      y: {
          beginAtZero: true,
      },
      },
  },
});


}

function showEventd(dataa){
  const dataString =dataa;
    const validJsonString = dataString.replace(/'/g, '"');
    const dataArray = JSON.parse(validJsonString);
//    console.log(dataArray);

    const onsetArray = [];
    const awakeArray = [];

      // Iterate through the original array
    for (const item of dataArray) {
        // Check if the item is "onset" and "awake" and push 1 or 0 accordingly
        if (item === "onset") {
            onsetArray.push(1);
            awakeArray.push(0);
        } else if (item === "wakeup") {
            onsetArray.push(0);
            awakeArray.push(1);
        } else {
            onsetArray.push(0);
            awakeArray.push(0);
        }
    }

//    console.log("onsetArray:", onsetArray);
//    console.log("awakeArray:", awakeArray);
  
  const canvas = document.getElementById("eventd-container");
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels :  Array.from({ length: dataArray.length }, (_, i) => i + 1),

        datasets: [
            {
                label: "Onset Data",
                data: onsetArray,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.1)",
                fill: true,
                borderWidth: 12
            } ,
            {
              label: "Awake Data",
              data: awakeArray,
              borderColor: "red",
              backgroundColor: "rgba(128, 0, 0, 0.1)",
              fill: true,
              borderWidth: 6
          } 
        ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
      x: {
          type: "linear", // Use linear scale for the x-axis (years)
          position: "bottom",
          fill : true,
      },
      y: {
          beginAtZero: true,
      },
      },
  },
});


}