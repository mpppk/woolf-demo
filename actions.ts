import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';
import { WoolfEventContext } from 'woolf/src/eventHandlers';
import { IWoolfData } from 'woolf/src/models';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import { IEdge, INode } from './components/Dagre';

export interface IRequestAmountChangingPayload {
  amount: number;
}

const counterActionCreatorFactory = actionCreatorFactory('COUNTER');

type ClickActionName =
  | 'clickIncrementButton'
  | 'clickDecrementButton'
  | 'clickAsyncIncrementButton';

export type CounterActionCreators = Record<
  ClickActionName,
  ActionCreator<undefined>
> & {
  requestAmountChanging: ActionCreator<IRequestAmountChangingPayload>;
};

export const counterActionCreators: CounterActionCreators = {
  clickAsyncIncrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_ASYNC_INCREMENT_BUTTON'
  ),
  clickDecrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_DECREMENT_BUTTON'
  ),
  clickIncrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_INCREMENT_BUTTON'
  ),
  requestAmountChanging: counterActionCreatorFactory<
    IRequestAmountChangingPayload
  >('REQUEST_AMOUNT_CHANGING')
};

export interface IRequestAmountChangingWithSleepPayload
  extends IRequestAmountChangingPayload {
  sleep: number;
}

export const counterAsyncActionCreators = {
  changeAmountWithSleep: counterActionCreatorFactory.async<
    IRequestAmountChangingWithSleepPayload,
    IRequestAmountChangingPayload,
    any
  >('REQUEST_AMOUNT_CHANGING_WITH_SLEEP')
};

type DagreActionName = 'update';

export type DagreActionCreators = Record<
  DagreActionName,
  ActionCreator<IDagreUpdatePayload>
  > & {
  update: ActionCreator<IDagreUpdatePayload>;
};

const dagreActionCreatorFactory = actionCreatorFactory('DAGRE');

export interface IDagreUpdatePayload {
  nodes: INode[],
  edges: IEdge[],
}

export const dagreActionCreators = {
  update: dagreActionCreatorFactory<IDagreUpdatePayload>(
    'UPDATE'
  ),
};

// type WoolfActionName = 'updateStats' | 'requestToRun';

const woolfActionCreatorFactory = actionCreatorFactory('WOOLF');

export interface IWoolfUpdatePayload {
  stats: IJobStat[],
}

export type WoolfRequestToRunPayload = undefined;

export interface IWoolfNewEventPayload {
  stats: IJobStat[];
  type: string;
  context: WoolfEventContext;
}

export const woolfActionCreators = {
  newEvent: woolfActionCreatorFactory<IWoolfNewEventPayload>('NEW_EVENT'),
  requestToRun: woolfActionCreatorFactory<WoolfRequestToRunPayload>('REQUEST_TO_RUN'),
  updateStats: woolfActionCreatorFactory<IWoolfUpdatePayload>(
    'UPDATE'
  ),
};
export type WoolfActionCreators = typeof woolfActionCreators;

export interface IWoolfRunStartedPayload {
  payload: IWoolfData,
}

export interface IWoolfRunDonePayload {
  results: IWoolfData,
}

export const woolfAsyncActionCreators = {
  run: woolfActionCreatorFactory.async<IWoolfRunStartedPayload, IWoolfRunDonePayload, undefined>('RUN')
};
