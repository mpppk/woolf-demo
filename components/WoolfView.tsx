import * as _ from 'lodash';
import React from 'react';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import { IJobStat, JobState } from 'woolf/src/scheduler/scheduler';
import Dagre, { ICluster, IEdge, INode } from './Dagre';

interface IWoolfProps {
  stats: IJobStat[];
  width: number;
  height: number;
  // onComponentDidMount: () => void,
}

export class WoolfView extends React.Component<IWoolfProps> {
  // tslint:disable-next-line member-access
  render() {
    const [clusters, nodes, edges] = statsToClustersAndNodesAndEdges(
      this.props.stats
    );
    return (
      <Dagre
        width={this.props.width}
        height={this.props.height}
        clusters={clusters}
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

const findJobByID = (stats: IJobStat[], id: number) => {
  const jobStat = stats.find(stat => stat.id === id);
  if (jobStat === undefined) {
    throw new Error('job does not exist. id: ' + id);
  }

  if (jobStat.funcs.length === 0) {
    throw new Error('job does not have any funcs. name: ' + jobStat.name);
  }
  return jobStat;
};

const jobIDToLastNodeName = (stats: IJobStat[], id: number): string => {
  const jobStat = findJobByID(stats, id);
  const funcStat = jobStat.funcs[jobStat.funcs.length - 1];
  return toNodeName(jobStat, funcStat);
};

const jobIDToFirstNodeName = (stats: IJobStat[], id: number) => {
  const jobStat = findJobByID(stats, id);
  const funcStat = jobStat.funcs[0];
  return toNodeName(jobStat, funcStat);
};

const toNodeName = (stat: IJobStat, funcStat: JobFuncStat) => {
  return `${stat.id}-${stat.name}-${funcStat.FunctionName}`;
};

const toClusterName = (jobStat: IJobStat) => {
  return 'cluster-' + String(jobStat.id);
};

const statsToClustersAndNodesAndEdges = (
  stats: IJobStat[]
): [ICluster[], INode[], IEdge[]] => {
  const clusters: ICluster[] = stats.map(
    (stat): ICluster => {
      return {
        clusterLabelPos: 'top',
        label: {
          class: 'cluster-' + stat.name,
          label: stat.name,
          style: 'fill: #d3d7e8'
        },
        name: toClusterName(stat)
      };
    }
  );

  const funcNodes: INode[][] = stats.map(stat => {
    return stat.funcs.map(
      (funcStat): INode => {
        return {
          label: {
            class: 'node-' + toNodeName(stat, funcStat),
            label: `${funcStat.FunctionName}(${funcStat.state})`,
            style: `fill: ${funcStateToColorCode(
              funcStat.state
            )}; stroke: #333; stroke-width: 1.5px;`
          },
          name: toNodeName(stat, funcStat),
          parent: toClusterName(stat)
        };
      }
    );
  });

  const funcEdges: IEdge[][] = stats.map(stat => {
    const es: IEdge[] = [];
    for (let i = 1; i < stat.funcs.length; i++) {
      es.push({
        name: toNodeName(stat, stat.funcs[i - 1]),
        targetId: toNodeName(stat, stat.funcs[i]),
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      });
    }
    return es;
  });

  const edges: IEdge[][] = stats.map(stat => {
    return stat.toJobIDs.map(toJobID => {
      return {
        name: jobIDToLastNodeName(stats, stat.id),
        targetId: jobIDToFirstNodeName(stats, toJobID),
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      };
    });
  });
  return [clusters, _.flatten(funcNodes), _.flatten([...edges, ...funcEdges])];
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

const funcStateToColorCode = (state: JobFuncState): string => {
  switch (state) {
    case JobFuncState.Done:
      return '#a0ffb3';
    case JobFuncState.Ready:
      return '#FF9E0F';
    case JobFuncState.Processing:
      return '#45E810';
  }
};
