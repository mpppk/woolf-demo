import { eventChannel } from 'redux-saga';
import { call, delay, put, take, takeLatest } from 'redux-saga/effects';
import { IWoolfEventHandlers, Woolf } from 'woolf';
import { woolfActionCreators } from '../actions';

export function* watchWoolfJobUpdate(woolf: Woolf) {
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

export function* watchWoolfNewEvent() {
  function* worker(action) {
    yield delay(300); // FIXME pick up wait time from state
    yield put(woolfActionCreators.updateStats({ stats: action.payload.stats }));
  }

  yield takeLatest(woolfActionCreators.newEvent.type, worker);
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
