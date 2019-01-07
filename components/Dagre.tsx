import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { Lamool } from 'lamool/src/lamool';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Woolf } from 'woolf';

interface IDagreProps {
  nodes: {};
  edges: Array<[string, string, {}]>;
  interactive: boolean;
  fit: boolean;
  height: string;
  width: string;
  shapeRenderers?: () => void;
  onNodeClick?: (id: any) => void; // FIXME
  zoom: number;
}

class DagreD3 extends React.Component<IDagreProps> {
  // tslint:disable-next-line member-access
  static defaultProps = {
    fit: true,
    height: '1',
    interactive: false,
    // width and height are defaulted to 1 due to a FireFox bug(?) If set to 0, it complains.
    width: '1',
    zoom: '2',
  };

  private nodeTree: any;
  private nodeTreeGroup: any;
  private woolf: Woolf;

  constructor(props) {
    super(props);
    this.woolf = new Woolf(new Lamool());
    this.woolf.newJob();
  }

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
    this.renderDag();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate() {
    this.renderDag();
  }

  // tslint:disable-next-line member-access
  render() {
    return (
      <svg
        className="dagre-d3"
        ref={r => {
          this.nodeTree = r;
        }}
        width={this.props.height}
        height={this.props.width}
      >
        <g
          ref={r => {
            this.nodeTreeGroup = r;
          }}
        />
      </svg>
    );
  }
  private renderDag() {
    const g = new dagreD3.graphlib.Graph().setGraph({});

    for (const [id, node] of Object.entries(this.props.nodes)) {
      g.setNode(id, node);
    }

    for (const edge of this.props.edges) {
      g.setEdge(edge[0], edge[1], edge[2]); // from, to, props
    }

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select(this.nodeTree);
    const inner = d3.select(this.nodeTreeGroup);

    // set up zoom support
    if (this.props.interactive) {
      const zoom = d3
        .zoom()
        .on('zoom', () => inner.attr('transform', d3.event.transform));
      svg.call(zoom);
    }

    // Create the renderer
    const render = new dagreD3.render();

    // set up custom shape renderers
    if (this.props.shapeRenderers) {
      for (const [shape, renderer] of Object.entries(
        this.props.shapeRenderers
      )) {
        render.shapes()[shape] = renderer;
      }
    }

    // Run the renderer. This is what draws the final graph.
    // @ts-ignore FIXME
    render(inner, g);

    // TODO add padding?
    if (this.props.fit) {
      const { height: gHeight, width: gWidth } = g.graph();
      const { height, width } = this.nodeTree.getBBox();
      const transX = width - gWidth;
      const transY = height - gHeight;
      svg.attr('height', height);
      svg.attr('width', width);
      // @ts-ignore FIXME
      inner.attr('transform', d3.zoomIdentity.translate(transX, transY));
    }

    if (this.props.onNodeClick) {
      svg
        .selectAll('.dagre-d3 .node')
        .on('click', id => this.props.onNodeClick(id));
    }
  }
}

export default DagreD3;
