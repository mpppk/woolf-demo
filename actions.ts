import actionCreatorFactory from 'typescript-fsa';
import { WoolfEventContext } from 'woolf/src/eventHandlers';
import { JobFuncStat } from 'woolf/src/job';
import { IWoolfData } from 'woolf/src/models';
import { IJobStat } from 'woolf/src/scheduler/scheduler';

const woolfActionCreatorFactory = actionCreatorFactory('WOOLF');

export interface IWoolfUpdatePayload {
  stats: IJobStat[];
}

export type WoolfRequestToRunPayload = undefined;

export interface IWoolfNewEventPayload {
  stats: IJobStat[];
  type: string;
  context: WoolfEventContext;
}

export interface IUpdateCurrentStatPayload {
  jobStat: IJobStat;
  funcStat?: JobFuncStat;
}

export const woolfActionCreators = {
  newEvent: woolfActionCreatorFactory<IWoolfNewEventPayload>('NEW_EVENT'),
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

export const woolfAsyncActionCreators = {
  run: woolfActionCreatorFactory.async<
    IWoolfRunStartedPayload,
    IWoolfRunDonePayload,
    undefined
  >('RUN')
};
