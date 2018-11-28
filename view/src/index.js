const d3 = require("d3");
const data = require("../../data/data-oba.json");

const obaData = d3
  .nest()
  .key(d => d.year)
  .rollup(d => d.length)
  .entries(data)
  .filter(y => y.key > 1909 && y.key < 1951);

const margin = 60;
const height = 600 - 2 * margin;
const width = 1240 - 2 * margin;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1240)
  .attr("height", 600);

const barChart = svg
  .append("g")
  .attr("transform", `translate(${margin - 30}, ${margin})`);

const yScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 150]);

barChart.append("g").call(d3.axisLeft(yScale));

const xScale = d3
  .scaleBand()
  .range([0, width])
  .domain(obaData.map(d => d.key))
  .padding(0.2);

barChart
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

barChart
  .selectAll()
  .data(obaData)
  .enter()
  .append("rect")
  .attr("x", data => xScale(data.key))
  .attr("y", data => yScale(data.value))
  .attr("height", data => height - yScale(data.value))
  .attr("width", xScale.bandwidth());
