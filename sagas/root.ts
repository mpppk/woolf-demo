import { all } from 'redux-saga/effects';
import { watchWoolfRequestToAssemble, watchWoolfRequestToRun } from './woolf';
import { watchWoolfNewEvent } from './woolfWatcher';

export default function* rootSaga() {
  yield all([
    watchWoolfRequestToRun(),
    watchWoolfRequestToAssemble(),
    watchWoolfNewEvent()
  ]);
}
