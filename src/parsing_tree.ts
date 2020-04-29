import * as d3 from 'd3';
import { Symbol } from './types';

const width = 600, height = 500, margin = 50;

export const setupTree = () => {
  // Clear title
  const page = d3.select('#page');
  page.select('h1').remove();
  page.style('display', 'block');

  // Select pane title
  page.select('.paneTitle').style('display', 'block');

  // Select SVG
  const svg = page.select('#svgPane')
    .attr('viewBox', `${-margin} ${-margin} ${width + 2 * margin} ${height + 2 * margin}`)
    .style('display', 'block');

  // Clear previous trees
  svg.selectAll('*').remove();

  // Initial setup and tree layout
  const treemap = d3.tree<Symbol>().size([width, height]);
  const nodesStructure = d3.hierarchy(window.parsingTree, d => d.children);
  const nodes = treemap(nodesStructure);

  // Add the link between the nodes
  const link = svg.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', '2px')
    .attr('d', d => `M${d.x},${d.y} C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`);

  // Add the nodes as circles
  const node = svg.selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  // Creates a circle where the node is supposed to be
  node.append('circle')
    .attr('r', 18)
    .attr('fill', 'deepskyblue');

  // Adds the symbol name to the node
  node.append('text')
    .attr('dy', 5)
    .style('text-anchor', 'middle')
    .text(d => d.data.name);

};