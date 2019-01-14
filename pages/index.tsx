import React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography/Typography';
import { counterActionCreators } from '../actions';
import AppBar from '../components/AppBar';
import Dagre, { IEdge, INode } from '../components/Dagre';
import LineChart from '../components/LineChart';
import { State } from '../reducer';

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

const onDagreDidMount = () => {
  console.log('dagre did mount'); // tslint:disable-line
};

interface IIndexProps {
  nodes: INode[],
  edges: IEdge[],
}

class Index extends React.Component<IIndexProps> {
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
          nodes={this.props.nodes}
          edges={this.props.edges}
          onComponentDidMount={onDagreDidMount}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: State): IIndexProps => {
  return {
    edges: state.edges,
    nodes: state.nodes,
  }
};

export default connect(mapStateToProps)(Index);
