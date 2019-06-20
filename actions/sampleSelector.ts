import actionCreatorFactory from 'typescript-fsa';
import { SampleName } from '../reducer';

const sampleSelectorActionCreatorFactory = actionCreatorFactory(
  'SAMPLE_SELECTOR'
);

export interface SampleSelectorChangePayload {
  selectedSampleName: SampleName;
}

export const sampleSelectorActionCreators = {
  change: sampleSelectorActionCreatorFactory<SampleSelectorChangePayload>(
    'CHANGE'
  )
};

export type SampleSelectorActionCreators = typeof sampleSelectorActionCreators;
