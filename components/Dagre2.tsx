import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import React from 'react';
// import isEqual from 'react-fast-compare';

// interface IDagreProps {
//   nodes: {};
//   edges: Array<[string, string, {}]>;
//   zoom: number;
// }

const styles = {
  edge: {
    arrowheadStyle: 'fill: #000',
    style: 'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;',
  },
  node: 'fill: #fff; stroke: #333; stroke-width: 1.5px;',
};

class Dagre2 extends React.Component {
  private node: any;
  // tslint:disable-next-line member-access
  static defaultProps = {
    zoom: '2'
  };

  // tslint:disable-next-line member-access
  // shouldComponentUpdate(nextProps, _nextState) {
  //   return (
  //     !isEqual(this.props.nodes, nextProps.nodes) ||
  //     !isEqual(this.props.edges, nextProps.edges) ||
  //     !isEqual(this.props.zoom, nextProps.zoom)
  //   );
  // }

  // tslint:disable-next-line member-access
  componentDidMount() {
    this.renderDag();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate() {
    this.renderDag();
  }

  // tslint:disable-next-line member-access
  renderDag() {
    // Create the input graph
    const g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });

    // Here we"re setting nodeclass, which is used by our custom drawNodes function
    // below.{ style: "fill: #afa" }
    g.setNode('0', { label: 'TOP', class: 'type-TOP', style: styles.node });
    g.setNode('1', { label: 'S', class: 'type-S', style: styles.node});
    g.setNode('2', { label: 'NP', class: 'type-NP', style: styles.node});
    g.setNode('3', { label: 'DT', class: 'type-DT', style: styles.node});
    g.setNode('4', { label: 'This', class: 'type-TK', style: styles.node});
    g.setNode('5', { label: 'VP', class: 'type-VP', style: styles.node});
    g.setNode('6', { label: 'VBZ', class: 'type-VBZ', style: styles.node});
    g.setNode('7', { label: 'is', class: 'type-TK', style: styles.node});
    g.setNode('8', { label: 'NP', class: 'type-NP', style: styles.node});
    g.setNode('9', { label: 'DT', class: 'type-DT', style: styles.node});
    g.setNode('10', { label: 'an', class: 'type-TK', style: styles.node});
    g.setNode('11', { label: 'NN', class: 'type-NN', style: styles.node});
    g.setNode('12', { label: 'example', class: 'type-TK', style: styles.node});
    g.setNode('13', { label: '.', class: 'type-.', style: styles.node});
    g.setNode('14', { label: 'sentence', class: 'type-TK', style: styles.node});

    g.nodes().forEach(v => {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });
    // Set up edges, no special attributes.
    g.setEdge('3', '4', {...styles.edge});
    g.setEdge('2', '3', {...styles.edge});
    g.setEdge('1', '2', {...styles.edge});
    g.setEdge('6', '7', {...styles.edge});
    g.setEdge('5', '6', {...styles.edge});
    g.setEdge('9', '10', {...styles.edge});
    g.setEdge('8', '9', {...styles.edge});
    g.setEdge('11', '12', {...styles.edge});
    g.setEdge('8', '11', {...styles.edge});
    g.setEdge('5', '8', {...styles.edge});
    g.setEdge('1', '5', {...styles.edge});
    g.setEdge('13', '14', {...styles.edge});
    g.setEdge('1', '13', {...styles.edge});
    g.setEdge('0', '1', {...styles.edge});

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3
      .select(this.node)
      .attr('width', 600)
      .attr('height', 300);
    const svgGroup = svg.append('g');
    const helloGroup = svg.append('hello');
    helloGroup.text('hello!');

    // Run the renderer. This is what draws the final graph.
    const selector = svg.select('g');
    render(selector as any, g);
    // Center the graph
    const width = parseInt(svg.attr('width'), 10);
    const xCenterOffset = (width - g.graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', g.graph().height + 40);
    this.node = svg;
  }
  // private renderDag() {
  //   const g = new dagreD3.graphlib.Graph().setGraph({});
  // }

  // tslint:disable-next-line member-access
  render() {
    return <svg ref={node => (this.node = node)}/>;
  }
}

export default Dagre2;
