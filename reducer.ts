import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { JobFuncState } from 'woolf/src/job';
import { IJobStat, JobState } from 'woolf/src/scheduler/scheduler';
import { IUpdateCurrentStatPayload, woolfActionCreators } from './actions';
import { sampleSelectorActionCreators } from './actions/sampleSelector';

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

export enum SampleName {
  LocalOnly = 'LocalOnly',
  OffloadToAWS = 'OffloadToAWS',
  AWSOnly = 'AWSOnly'
}

export const exampleInitialState = {
  availableSampleNames: [
    SampleName.LocalOnly,
    SampleName.OffloadToAWS,
    SampleName.AWSOnly
  ],
  count: 0,
  currentStat: {
    funcStat: null,
    jobStat: null
  } as IUpdateCurrentStatPayload,
  sampleName: SampleName.LocalOnly,
  stats
};

export type State = typeof exampleInitialState;

const reducer = reducerWithInitialState(exampleInitialState)
  .case(sampleSelectorActionCreators.change, (state, payload) => {
    return { ...state, sampleName: payload.selectedSampleName };
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
  });

export default reducer;
