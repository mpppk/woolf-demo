import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { counterActionCreators, counterAsyncActionCreators, dagreActionCreators } from './actions';
import { IEdge, INode } from './components/Dagre';

const styles = {
  edge: {
    arrowheadStyle: 'fill: #000',
    style:
      'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
  },
  node: 'fill: #fff; stroke: #333; stroke-width: 1.5px;'
};

const nodes: INode[] = [
  {
    label: {
      class: 'type-TOP',
      label: 'TOP',
      style: styles.node
    },
    name: '0'
  },
  {
    label: {
      class: 'type-S',
      label: 'S',
      style: styles.node
    },
    name: '1'
  }
];

const edges: IEdge[] = [
  {
    name: '0',
    targetId: '1',
    value: { ...styles.edge }
  }
];

export const exampleInitialState = {
  count: 0,
  edges,
  nodes,
};

export type State = typeof exampleInitialState;

const addCount = (state: State, amount: number) => {
  return { ...state, count: state.count + amount };
};

const reducer = reducerWithInitialState(exampleInitialState)
  .case(counterActionCreators.clickIncrementButton, state => {
    return addCount(state, 1);
  })
  .case(counterActionCreators.clickDecrementButton, state => {
    return addCount(state, -1);
  })
  .case(
    counterAsyncActionCreators.changeAmountWithSleep.done,
    (state, payload) => {
      return addCount(state, payload.result.amount);
    }
  )
  .case(
    dagreActionCreators.update,
    (state, payload) => {
      return {...state, nodes: payload.nodes, edges: payload.edges};
    }
  );

export default reducer;
