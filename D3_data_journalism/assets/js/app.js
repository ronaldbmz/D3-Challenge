// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".bubblechart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params for x-axis
var chosenXAxis = "poverty";

// Initial Params for y-axis
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(DemoghrapicData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(DemoghrapicData, d =>  d[chosenXAxis])-1, d3.max(DemoghrapicData, d =>  d[chosenXAxis])])
      .range([0, width]);
  
    return xLinearScale;
  
  }
  
  // function used for updating y-scale var upon click on axis label
  function yScale(DemoghrapicData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(DemoghrapicData, d => d[chosenYAxis])-1, d3.max(DemoghrapicData, d => d[chosenYAxis])])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderCirclesLabels(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis])-8)
      .attr("y", d => newYScale(d[chosenYAxis]));
      
  
    return textGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "In Proverty (%)";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age (Median)";
    }
    else {
      xlabel = "Household Income (Median)";
    }
    
    if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokes (%)";
    }
    else {
      ylabel = "Obese (%)";
    }
  
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
        });
  
    chartGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/data.csv").then(function(DemoghrapicData, err) {
    if (err) throw err;
  
    // parse data
    DemoghrapicData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.abbr = data.abbr
    });
  
// xLinearScale function above csv import
var xLinearScale = xScale(DemoghrapicData, chosenXAxis);
  
// yLinearScale function above csv import
var yLinearScale = yScale(DemoghrapicData, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

var yAxis = chartGroup.append("g")
.classed("y-axis", true)
.call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
.data(DemoghrapicData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 20)
.attr("fill", "blue")
.attr("opacity", ".5")
;












































