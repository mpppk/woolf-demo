/* global fetch */

import es6promise from 'es6-promise';
import 'isomorphic-unfetch';
import { SagaIterator } from 'redux-saga';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { Woolf } from 'woolf/src/woolf';
import {
  IWoolfRunDonePayload,
  woolfActionCreators,
  woolfAsyncActionCreators
} from './actions';
import { watchWoolfJobUpdate, watchWoolfNewEvent } from './sagas/woolfWatcher';
import { get } from './services/samples/Samples';

es6promise.polyfill();

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
    const sample = get(payload.sampleName);
    woolfState.woolf = yield call(sample.getWoolf.bind(sample));
    yield fork(watchWoolfJobUpdate, woolfState.woolf);
    yield put(
      woolfActionCreators.updateStats({ stats: woolfState.woolf.stats() })
    );
  }
);

function* watchWoolfRequestToAssemble() {
  function* worker({ payload }) {
    yield call(woolfAssembleWorker, payload);
  }

  yield takeEvery<ReturnType<typeof woolfActionCreators.requestToAssemble>>(
    woolfActionCreators.requestToAssemble,
    worker
  );
}

function* watchWoolfRequestToRun() {
  function* worker({ payload }) {
    const p = { ...payload, count: 0 };
    yield call(woolfRunWorker, { payload: p });
  }

  yield takeEvery<ReturnType<typeof woolfActionCreators.requestToRun>>(
    woolfActionCreators.requestToRun,
    worker
  );
}

export default function* rootSaga() {
  yield all([
    watchWoolfRequestToRun(),
    watchWoolfRequestToAssemble(),
    watchWoolfNewEvent()
  ]);
}
