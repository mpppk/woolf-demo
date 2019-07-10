import { combineReducers } from 'redux';
import woolfReducer, { WoolfInitialState, woolfInitialState } from './woolf';

export const exampleInitialState = {
  woolf: woolfInitialState as WoolfInitialState
};
export type State = typeof exampleInitialState;

export default combineReducers({ woolf: woolfReducer });
