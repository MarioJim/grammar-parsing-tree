import * as d3 from 'd3';
import { Symbol, isTerminalSymbol } from './types';

const width = 600, height = 500, margin = 50;

/**
 * Creates a path between point A and point B
 * @param pointA starting point of the path
 * @param pointB ending point of the path
 */
const generateLinkPath = (
  pointA: d3.HierarchyPointNode<Symbol>,
  pointB: d3.HierarchyPointNode<Symbol>
): string => `
    M${pointA.x},${height - pointA.y}
    C${pointA.x},${height - (pointA.y + pointB.y) / 2}
     ${pointB.x},${height - (pointA.y + pointB.y) / 2}
     ${pointB.x},${height - pointB.y}`;

/**
 * Generates the svg structure of a tree on a svg element with id
 * svgPane on a element with id page
 */
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
  const cluster = d3.cluster<Symbol>().size([width, height]);
  const nodesStructure = d3.hierarchy(window.parsingTree, d => d.children);
  const nodes = cluster(nodesStructure);

  // Add the link between the nodes
  const link = svg.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', '2px')
    .attr('d', d => generateLinkPath(d, d.parent));

  // Add the nodes as circles
  const node = svg.selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x},${height - d.y})`);

  // Creates a circle where the node is supposed to be
  node.append('circle')
    .attr('r', 18)
    .attr('fill', 'white')
    .attr('stroke-width', 3)
    .attr('stroke', d => isTerminalSymbol(d.data.name) ? 'steelblue' : 'green');

  // Adds the symbol name to the node
  node.append('text')
    .attr('dy', 5)
    .style('text-anchor', 'middle')
    .text(d => d.data.name);
};