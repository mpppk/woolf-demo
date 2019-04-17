import * as _ from 'lodash';
import React from 'react';
import { IJobStat, JobState } from 'woolf/src/scheduler/scheduler';
import Dagre, { IEdge, INode } from './Dagre';

interface IWoolfProps {
  stats: IJobStat[];
  // onComponentDidMount: () => void,
}

export class WoolfView extends React.Component<IWoolfProps> {
  // tslint:disable-next-line member-access
  render() {
    const [nodes, edges] = statsToNodesAndEdges(this.props.stats);
    return (
      <Dagre
        nodes={nodes}
        edges={edges}
        // onComponentDidMount={this.onDagreDidMount}
      />
    );
  }

  // private onDagreDidMount = () => {
  //   // const [nodes, edges] = statsToNodesAndEdges(this.props.stats);
  //   this.props.onComponentDidMount();
  // };
}

const statsToNodesAndEdges = (stats: IJobStat[]): [INode[], IEdge[]] => {
  const nodes: INode[] = stats.map(stat => {
    return {
      label: {
        class: 'type-' + stat.name,
        label: `${stat.name}(${stat.state})`,
        style: `fill: ${jobStateToColorCode(
          stat.state
        )}; stroke: #333; stroke-width: 1.5px;`
      },
      name: String(stat.id)
    };
  });

  const edges: IEdge[][] = stats.map(stat => {
    return stat.toJobIDs.map(toJobID => {
      return {
        name: String(stat.id),
        targetId: String(toJobID),
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      };
    });
  });
  return [nodes, _.flatten(edges)];
};

const jobStateToColorCode = (jobState: JobState): string => {
  switch (jobState) {
    case JobState.Done:
      return '#a0ffb3';
    case JobState.Ready:
      return '#FF9E0F';
    case JobState.Processing:
      return '#45E810';
    case JobState.Suspend:
      return '#4670ff';
  }
};
