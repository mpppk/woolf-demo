import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { IJobStat } from 'woolf';
import { IUpdateCurrentStatPayload, woolfActionCreators } from './actions';
import { sampleSelectorActionCreators } from './actions/sampleSelector';
import * as Samples from './services/samples/Samples';

export const exampleInitialState = {
  availableSampleNames: Samples.getNames(),
  count: 0,
  currentStat: {
    funcStat: null,
    jobStat: null
  } as IUpdateCurrentStatPayload,
  sampleName: Samples.getNames()[0],
  stats: [] as IJobStat[]
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
