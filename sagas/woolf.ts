import { SagaIterator } from 'redux-saga';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { Woolf } from 'woolf';
import {
  IWoolfRunDonePayload,
  woolfActionCreators,
  woolfAsyncActionCreators
} from '../actions';
import { getSample } from '../services/samples/Samples';
import { watchWoolfJobUpdate } from './woolfWatcher';

export interface WoolfState {
  woolf: Woolf | null;
}

const woolfState: WoolfState = { woolf: null };
const woolfRunWorker = bindAsyncAction(woolfAsyncActionCreators.run)(function*({
  payload
}): SagaIterator {
  const woolfResults = (yield call(
    woolfState.woolf.run.bind(woolfState.woolf),
    payload
  )) as IWoolfRunDonePayload;
  return { woolfResults };
});

const woolfAssembleWorker = bindAsyncAction(woolfAsyncActionCreators.assemble)(
  function*(payload): SagaIterator {
    const sample = getSample(payload.sampleName);
    woolfState.woolf = yield call(sample.getWoolf.bind(sample));
    yield fork(watchWoolfJobUpdate, woolfState.woolf);
    yield put(
      woolfActionCreators.updateStats({ stats: woolfState.woolf.stats() })
    );
  }
);

export function* watchWoolfRequestToAssemble() {
  function* worker({ payload }) {
    yield call(woolfAssembleWorker, payload);
  }

  yield takeEvery<ReturnType<typeof woolfActionCreators.requestToAssemble>>(
    woolfActionCreators.requestToAssemble,
    worker
  );
}

export function* watchWoolfRequestToRun() {
  function* worker({ payload }) {
    const p = { ...payload, count: 0 };
    yield call(woolfRunWorker, { payload: p });
  }

  yield takeEvery<ReturnType<typeof woolfActionCreators.requestToRun>>(
    woolfActionCreators.requestToRun,
    worker
  );
}
