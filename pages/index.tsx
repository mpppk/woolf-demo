import React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography/Typography';
import { counterActionCreators } from '../actions';
import AppBar from '../components/AppBar';
import Dagre, { IEdge, INode } from '../components/Dagre';
import LineChart from '../components/LineChart';

const data = [
  [
    { x: 0, y: 6 },
    { x: 1, y: 9 },
    { x: 2, y: 6 },
    { x: 3, y: 5 },
    { x: 4, y: 2 },
    { x: 6, y: 4 },
    { x: 7, y: 2 },
    { x: 8, y: 5 },
    { x: 9, y: 2 }
  ]
];

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

const onDagreDidMount = () => {
  console.log('dagre did mount'); // tslint:disable-line
};

class Index extends React.Component {
  // tslint:disable-next-line member-access
  static async getInitialProps(props) {
    const { store, isServer } = props.ctx;
    store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
    return { isServer };
  }

  // tslint:disable-next-line member-access
  render() {
    return (
      <div>
        <AppBar />
        <Typography variant="h2" gutterBottom={true}>
          Index Page
        </Typography>
        <LineChart data={data} />
        <Dagre
          nodes={nodes}
          edges={edges}
          onComponentDidMount={onDagreDidMount}
        />
      </div>
    );
    // return <Page title="Index Page" />;
  }
}

export default connect()(Index);
