import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { IJobStat } from 'woolf';
import { IWoolfData } from 'woolf/src/models';
import {
  IUpdateCurrentStatPayload,
  woolfActionCreators,
  woolfAsyncActionCreators
} from '../actions';

export const woolfInitialState = {
  currentStat: {
    funcStat: null,
    jobStat: null
  } as IUpdateCurrentStatPayload,
  runPayload: {} as IWoolfData,
  stats: [] as IJobStat[],
  woolfResults: [] as IWoolfData[]
};
export type WoolfInitialState = typeof woolfInitialState;

const woolfReducer = reducerWithInitialState(woolfInitialState)
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

export default woolfReducer;
