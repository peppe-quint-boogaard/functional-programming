const margin = 60;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const svg = d3.select('svg');

const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

const yScale = d3.scaleLinear().range([height:])
