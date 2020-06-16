import * as d3 from './d3bundle';
import { isTerminalSymbol, Point, Derivation } from './types';

const width = 800;
const height = 500;
const margin = 50;
const transitionDuration = 700;
const circleSize = 18;

/**
 * Creates a path between point A and point B
 * @param pointA starting point of the path
 * @param pointB ending point of the path
 */
const generateLinkPath = (pointA: Point, pointB: Point): string => `
    M${pointA.x},${height - pointA.y}
    C${pointA.x},${height - (pointA.y + pointB.y) / 2}
     ${pointB.x},${height - (pointA.y + pointB.y) / 2}
     ${pointB.x},${height - pointB.y}`;

/**
 * Generates the svg structure of a tree on a svg element with id
 * svg-pane on a element with id tree-page
 */
export const setupTree = () => {
  // Initialize tree
  window.parsingTree = {
    name: window.grammarStructure.startingSymbol,
    children: [],
  };

  // Select SVG and clear previous trees
  const svg = d3
    .select('#svg-pane')
    .attr(
      'viewBox',
      `${-margin} ${-margin} ${width + 2 * margin} ${height + 2 * margin}`,
    )
    .style('display', 'block');
  svg.select('g.links').selectAll('*').remove();
  svg.select('g.nodes').selectAll('*').remove();

  // Set initial source circle position
  window.oldSourcePoint = { x: width / 2, y: 0 };

  // Display tree
  updateTree();
};

/**
 * Updates the tree previously rendered by setupTree
 */
export const updateTree = () => {
  const svg = d3.select('#svg-pane');
  const linksGroup = svg.select('g.links');
  const nodesGroup = svg.select('g.nodes');

  // Recalculate tree layout
  const treemap = d3.tree<Derivation>().size([width, height]);
  const nodesStructure = d3.hierarchy(window.parsingTree, (d) => d.children);
  const nodesLayout = treemap(nodesStructure);
  const newSourcePoint = nodesLayout.descendants()[0];

  /**
   * Nodes
   */
  const nodes = nodesGroup
    .selectAll<SVGGElement, any>('g.node')
    .data(nodesLayout.descendants(), (d) => d.data.name);

  // Selects the new nodes (that don't have an svg element tied to them)
  const newNodes = nodes
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr(
      'transform',
      `translate(${window.oldSourcePoint.x},${
        height - window.oldSourcePoint.y
      }) scale(0)`,
    );

  // Creates an ellipse where the node is supposed to be
  newNodes
    .append('ellipse')
    .attr('rx', 2 * circleSize)
    .attr('ry', circleSize)
    .attr('fill', 'white')
    .attr('stroke-width', 3)
    .attr('stroke', (d) =>
      isTerminalSymbol(d.data.name) ? 'steelblue' : 'green',
    );

  // Adds the symbol name to the node
  newNodes
    .append('text')
    .attr('dy', 5)
    .style('text-anchor', 'middle')
    .text((d) => d.data.name);

  // Select the nodes that need to stay and transition them to their new position
  newNodes
    .merge(nodes)
    .transition()
    .duration(transitionDuration)
    .attr('transform', (d) => `translate(${d.x},${height - d.y}) scale(1)`);

  // Select the nodes that need to be removed and delete them after an animation
  nodes
    .exit()
    .transition()
    .duration(transitionDuration)
    .attr(
      'transform',
      `translate(${newSourcePoint.x},${height - newSourcePoint.y}) scale(0)`,
    )
    .remove();

  /**
   * Links
   */
  const links = linksGroup
    .selectAll<SVGPathElement, any>('path.link')
    .data(nodesLayout.descendants().slice(1), (d) => d.data.name);

  // Select the new links and draw them
  const newLinks = links
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#BBB')
    .attr('stroke-width', 2)
    .attr('d', generateLinkPath(window.oldSourcePoint, window.oldSourcePoint));

  // Move links to their new position
  newLinks
    .merge(links)
    .transition()
    .duration(transitionDuration)
    .attr('d', (d) => generateLinkPath(d.parent, d));

  // Remove links that have disappeared
  links
    .exit()
    .transition()
    .duration(transitionDuration)
    .attr('d', generateLinkPath(newSourcePoint, newSourcePoint))
    .remove();

  // Update source coords
  window.oldSourcePoint = {
    x: newSourcePoint.x,
    y: newSourcePoint.y,
  };
};
