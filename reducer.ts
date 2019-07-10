import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { IJobStat } from 'woolf';
import { IWoolfData } from 'woolf/src/models';
import {
  IUpdateCurrentStatPayload,
  woolfActionCreators,
  woolfAsyncActionCreators
} from './actions';
import * as Samples from './services/samples/Samples';

export const exampleInitialState = {
  availableSampleNames: Samples.getNames(),
  count: 0,
  currentStat: {
    funcStat: null,
    jobStat: null
  } as IUpdateCurrentStatPayload,
  runPayload: {} as IWoolfData,
  sampleName: Samples.getNames()[0],
  stats: [] as IJobStat[],
  woolfResults: [] as IWoolfData[]
};

export type State = typeof exampleInitialState;

const reducer = reducerWithInitialState(exampleInitialState)
  .case(woolfActionCreators.updateCurrentStat, (state, currentStat) => {
    return { ...state, currentStat };
  })
  .case(woolfAsyncActionCreators.run.started, (state, payload) => {
    return { ...state, runPayload: payload.payload };
  })
  .case(woolfAsyncActionCreators.run.done, (state, payload) => {
    return { ...state, woolfResults: payload.result.woolfResults };
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
