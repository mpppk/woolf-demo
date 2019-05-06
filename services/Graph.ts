import { Edge, graphlib } from 'dagre';
import * as dagreD3 from 'dagre-d3';
import { ICluster, IEdge, INode } from '../components/Dagre';
import { GraphCluster } from './GraphCluster';
import { GraphNode } from './GraphNode';

export class Graph {
  public readonly node: GraphNode;
  public readonly cluster: GraphCluster;

  private readonly g: graphlib.Graph;

  constructor(clusters: ICluster[], nodes: INode[], edges: IEdge[]) {
    this.g = new dagreD3.graphlib.Graph({ compound: true })
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });

    this.node = new GraphNode(this.g);
    this.cluster = new GraphCluster(this.g);
    this.node.sync(nodes);
    this.cluster.sync(clusters);
    this.addEdges(edges);
  }

  public toGraph(): graphlib.Graph {
    return this.g;
  }

  public addEdge(edge: IEdge) {
    this.g.setEdge(edge.name, edge.targetId, edge.value);
  }

  public addEdges(edges: IEdge[]) {
    edges.forEach(edge => this.addEdge(edge));
  }

  public hasEdge(edge: IEdge): boolean {
    return this.g.hasEdge(edge.name, edge.targetId);
  }

  public updateEdges(newEdges: IEdge[]) {
    const addedEdges = newEdges.filter(c => !this.hasEdge(c));
    const removedEdges = this.g.edges().filter(e => {
      const targetEdge = newEdges.find(newEdge => newEdge.name === e.name);
      return targetEdge === undefined;
    });

    this.removeEdges(removedEdges);
    this.addEdges(addedEdges);
  }

  public removeEdge(edge: Edge) {
    this.g.removeEdge(edge.name, edge.v);
  }

  public removeEdges(edges: Edge[]) {
    edges.forEach(edge => {
      this.removeEdge(edge);
    });
  }
}
