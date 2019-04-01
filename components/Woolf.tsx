import * as _ from 'lodash';
import React from 'react';
import { ActionCreator } from 'typescript-fsa';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import { IDagreUpdatePayload } from '../actions';
import Dagre, { IEdge, INode } from './Dagre';

interface IWoolfProps {
  stats: IJobStat[],
  update: ActionCreator<IDagreUpdatePayload>,
}

// TODO: Woolfをindex.tsxから読み込んで、表示されるかを確認
// まずは手でwoolf statsを作る
export class Woolf extends React.Component<IWoolfProps> {
  // tslint:disable-next-line member-access
  render() {
    const [nodes, edges] = statsToNodesAndEdges(this.props.stats);
    return (
      <Dagre
        nodes={nodes}
        edges={edges}
        onComponentDidMount={this.onDagreDidMount}
      />
    );
  }

  private onDagreDidMount = () => {
    const [nodes, edges] = statsToNodesAndEdges(this.props.stats);
    this.props.update({
      edges,
      nodes,
    });
  };
}

const statsToNodesAndEdges = (stats: IJobStat[]): [INode[], IEdge[]] => {
  const nodes: INode[] = stats.map((stat) => {
    return {
      label: {
        class: 'type-' + stat.name,
        label: stat.name,
        style: 'fill: #fff; stroke: #333; stroke-width: 1.5px;',
      },
      name: String(stat.id),
    };
  });

  const edges: IEdge[][] = stats.map((stat) => {
    return stat.toJobIDs.map((toJobID) => {
      return {
        name: String(stat.id),
        targetId: String(toJobID),
        value: {
          arrowheadStyle: 'fill: #000',
          style: 'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        },
      };
    });
  });
  return [nodes, _.flatten(edges)];
};