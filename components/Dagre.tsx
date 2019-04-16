import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { Label } from 'dagre-d3';
import React from 'react';
import isEqual from 'react-fast-compare';

export interface INode {
  name: string;
  label: Label;
}

export interface IEdge {
  name: string;
  targetId: string;
  value: Label;
}

interface IDagreProps {
  nodes: INode[];
  edges: IEdge[];
  zoom: number;
  // onComponentDidMount: () => void;
}

class Dagre extends React.Component<IDagreProps> {
  // tslint:disable-next-line member-access
  static defaultProps = {
    zoom: '2'
  };
  private node: any;

  // tslint:disable-next-line member-access
  shouldComponentUpdate(nextProps, _nextState) {
    return (
      !isEqual(this.props.nodes, nextProps.nodes) ||
      !isEqual(this.props.edges, nextProps.edges) ||
      !isEqual(this.props.zoom, nextProps.zoom)
    );
  }

  // tslint:disable-next-line member-access
  componentDidMount() {
    // this.props.onComponentDidMount();
    this.renderGraph();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate() {
    this.renderGraph();
  }

  // tslint:disable-next-line member-access
  renderGraph() {
    // Create the input graph
    const g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });

    this.props.nodes.forEach((node) => {
      g.setNode(node.name, node.label);
    });

    g.nodes().forEach(v => {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });
    this.props.edges.forEach((edge) => g.setEdge(edge.name, edge.targetId, edge.value));

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

  // tslint:disable-next-line member-access
  render() {
    return <svg ref={node => (this.node = node)}/>;
  }
}

export default Dagre;
