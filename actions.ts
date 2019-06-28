import actionCreatorFactory from 'typescript-fsa';
import { Woolf } from 'woolf';
import { WoolfEventContext } from 'woolf/src/eventHandlers';
import { JobFuncStat } from 'woolf/src/job';
import { IWoolfData } from 'woolf/src/models';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import { SampleName } from './services/samples/Samples';

const woolfActionCreatorFactory = actionCreatorFactory('WOOLF');

export interface IWoolfUpdatePayload {
  stats: IJobStat[];
}

export type WoolfRequestToRunPayload = IWoolfData;

export interface IWoolfNewEventPayload {
  stats: IJobStat[];
  type: string;
  context: WoolfEventContext;
}

export interface IUpdateCurrentStatPayload {
  jobStat: IJobStat;
  funcStat?: JobFuncStat;
}

interface WoolfRequestToAssemblePayload {
  sampleName: SampleName;
}

export const woolfActionCreators = {
  newEvent: woolfActionCreatorFactory<IWoolfNewEventPayload>('NEW_EVENT'),
  requestToAssemble: woolfActionCreatorFactory<WoolfRequestToAssemblePayload>(
    'REQUEST_TO_ASSEMBLE'
  ),
  requestToRun: woolfActionCreatorFactory<WoolfRequestToRunPayload>(
    'REQUEST_TO_RUN'
  ),
  updateCurrentStat: woolfActionCreatorFactory<IUpdateCurrentStatPayload>(
    'UPDATE_CURRENT_STAT'
  ),
  updateStats: woolfActionCreatorFactory<IWoolfUpdatePayload>('UPDATE')
};
export type WoolfActionCreators = typeof woolfActionCreators;

export interface IWoolfRunStartedPayload {
  payload: IWoolfData;
}

export interface IWoolfRunDonePayload {
  results: IWoolfData;
}

interface IWoolfAssembleDonePayload {
  woolf: Woolf;
}

export const woolfAsyncActionCreators = {
  assemble: woolfActionCreatorFactory.async<
    undefined,
    IWoolfAssembleDonePayload,
    undefined
  >('ASSEMBLE'),
  run: woolfActionCreatorFactory.async<
    IWoolfRunStartedPayload,
    IWoolfRunDonePayload,
    undefined
  >('RUN')
};
