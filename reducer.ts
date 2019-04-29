import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { JobFuncState } from 'woolf/src/job';
import { IJobStat, JobState } from 'woolf/src/scheduler/scheduler';
import {
  counterActionCreators,
  counterAsyncActionCreators,
  dagreActionCreators,
  IUpdateCurrentStatPayload,
  woolfActionCreators
} from './actions';

// const styles = {
//   edge: {
//     arrowheadStyle: 'fill: #000',
//     style:
//       'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
//   },
//   node: 'fill: #fff; stroke: #333; stroke-width: 1.5px;'
// };

// const nodes: INode[] = [
//   {
//     label: {
//       class: 'type-TOP',
//       label: 'TOP',
//       style: styles.node
//     },
//     name: '0'
//   },
//   {
//     label: {
//       class: 'type-S',
//       label: 'S',
//       style: styles.node
//     },
//     name: '1'
//   }
// ];
//
// const edges: IEdge[] = [
//   {
//     name: '0',
//     targetId: '1',
//     value: { ...styles.edge }
//   }
// ];

const stats: IJobStat[] = [
  {
    fromJobIDs: [] as number[],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Done
      } as any
    ],
    id: 0,
    name: 'some-job',
    state: JobState.Done,
    toJobIDs: [1]
  },
  {
    fromJobIDs: [0],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Ready
      } as any,
      {
        FunctionName: 'test-func06',
        state: JobFuncState.Done
      } as any
    ],
    id: 1,
    name: 'another-job',
    state: JobState.Ready,
    toJobIDs: [2, 3]
  },
  {
    fromJobIDs: [1],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Done
      } as any
    ],
    id: 2,
    name: 'suspend-job',
    state: JobState.Suspend,
    toJobIDs: []
  },
  {
    fromJobIDs: [2],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Done
      } as any
    ],
    id: 3,
    name: 'suspend-job2',
    state: JobState.Suspend,
    toJobIDs: []
  }
];

export const exampleInitialState = {
  count: 0,
  currentStat: {
    funcStat: null,
    jobStat: null
  } as IUpdateCurrentStatPayload,
  stats
};

export type State = typeof exampleInitialState;

const addCount = (state: State, amount: number) => {
  return { ...state, count: state.count + amount };
};

const reducer = reducerWithInitialState(exampleInitialState)
  .case(counterActionCreators.clickIncrementButton, state => {
    return addCount(state, 1);
  })
  .case(counterActionCreators.clickDecrementButton, state => {
    return addCount(state, -1);
  })
  .case(
    counterAsyncActionCreators.changeAmountWithSleep.done,
    (state, payload) => {
      return addCount(state, payload.result.amount);
    }
  )
  .case(dagreActionCreators.update, (state, payload) => {
    return { ...state, nodes: payload.nodes, edges: payload.edges };
  })
  .case(woolfActionCreators.updateCurrentStat, (state, currentStat) => {
    return { ...state, currentStat };
  })
  .case(woolfActionCreators.updateStats, (state, payload) => {
    const noFuncsStat = state.stats.find(
      stat => !stat.funcs || stat.funcs.length <= 0
    );
    if (noFuncsStat) {
      return { ...state };
    }
    return { ...state, stats: payload.stats };
  })
  .case(
    // FIXME merge to updateStats action
    woolfActionCreators.newEvent,
    (state, payload) => {
      return { ...state, stats: payload.stats };
    }
  );

export default reducer;
