/* global fetch */

import es6promise from 'es6-promise';
import 'isomorphic-unfetch';
import { LambdaFunction } from 'lamool/src/lambda';
import { Lamool } from 'lamool/src/lamool';
import { map } from 'p-iteration';
import { eventChannel, SagaIterator } from 'redux-saga';
import {
  all,
  call,
  delay,
  fork,
  put,
  take,
  takeEvery
} from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { IWoolfEventHandlers } from 'woolf/src/eventHandlers';
import { Woolf } from 'woolf/src/woolf';
import {
  counterActionCreators,
  counterAsyncActionCreators,
  woolfActionCreators,
  woolfAsyncActionCreators
} from './actions';

es6promise.polyfill();

const counterIncrementWorker = bindAsyncAction(
  counterAsyncActionCreators.changeAmountWithSleep
)(function*(payload): SagaIterator {
  yield call(delay, payload.sleep);
  return { amount: payload.amount };
});

function* watchIncrementAsync() {
  yield takeEvery(counterActionCreators.clickAsyncIncrementButton.type, () =>
    counterIncrementWorker({ amount: 1, sleep: 1000 })
  );
}

// FIXME add type to emitter
const createWoolfEventChannelHandler: (emitter: any) => IWoolfEventHandlers = (
  emitter: any
) => {
  const contextEmitHandler = (type, context) => {
    emitter({ type, context });
  };
  return {
    addFunc: [contextEmitHandler],
    addNewJob: [contextEmitHandler],
    change: [contextEmitHandler],
    finish: [contextEmitHandler],
    finishFunc: [contextEmitHandler],
    finishJob: [contextEmitHandler],
    start: [contextEmitHandler],
    startFunc: [contextEmitHandler],
    startJob: [contextEmitHandler]
  };
};

function* woolfEventHandlerChannel(woolf: Woolf) {
  // FIXME Add type to subscribe cb
  return eventChannel<any>(emitter => {
    woolf.updateEventHandlers(createWoolfEventChannelHandler(emitter));
    // FIXME Implement unsubscribe method
    return () => {}; // tslint:disable-line
  });
}

const woolfRunWorker = bindAsyncAction(woolfAsyncActionCreators.run)(function*({
  payload
}): SagaIterator {
  const woolf = yield call(dummyWoolf);
  yield put(woolfActionCreators.updateStats({ stats: woolf.stats() }));
  yield fork(watchWoolfJobUpdate, woolf);
  return yield call(woolf.run.bind(woolf), payload);
});

function* watchWoolfJobUpdate(woolf: Woolf) {
  const chan = yield call(woolfEventHandlerChannel, woolf);
  while (true) {
    const { type, context } = yield take(chan);
    yield put(
      woolfActionCreators.newEvent({
        context,
        stats: woolf.stats(),
        type
      })
    );
  }
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

const dummyWoolf = async (): Promise<Woolf> => {
  const sleepLambdaFunction: LambdaFunction = (event, _, cb) => {
    setTimeout(() => {
      cb(null, event);
    }, 2000);
  };

  const woolf = new Woolf(new Lamool());

  const jobs = await map([...Array(12)], async () => {
    const job = woolf.newJob();
    await job.addFunc(sleepLambdaFunction);
    return job;
  });

  const firstJob = jobs.shift();
  const lastJob = jobs.pop();
  jobs.forEach(job => {
    woolf.addDependency(firstJob, job);
    woolf.addDependency(job, lastJob);
  });
  return woolf;
};

export default function* rootSaga() {
  yield all([watchIncrementAsync(), watchWoolfRequestToRun()]);
}
