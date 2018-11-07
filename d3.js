const margin = 60;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const svg = d3.select('svg');

const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
chart.append('g').call(d3.axisLeft(yScale));

const xScale = d3.scaleBand().range([0, width]).domain(sample.map((s) => s.language)).padding(0.2);

chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
