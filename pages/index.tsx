import React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography/Typography';
import { bindActionCreators } from 'redux';
import { ActionCreator } from 'typescript-fsa';
import { counterActionCreators, dagreActionCreators, DagreActionCreators, IDagreUpdatePayload } from '../actions';
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

interface IIndexProps {
  nodes: INode[],
  edges: IEdge[],
  update: ActionCreator<IDagreUpdatePayload>,
}

class Index extends React.Component<IIndexProps> {
  // tslint:disable-next-line member-access
  static async getInitialProps(props) {
    const { store, isServer } = props.ctx;
    store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
    return { isServer };
  }

  constructor(props) {
    super(props);
    this.onDagreDidMount = this.onDagreDidMount.bind(this);
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
          onComponentDidMount={this.onDagreDidMount}
        />
      </div>
    );
  }

  private onDagreDidMount = () => {
    this.props.update({
      edges: this.props.edges,
      nodes: this.props.nodes,
    });
  };
}

const mapStateToProps = (state: State): Partial<IIndexProps> => {
  return {
    edges: state.edges,
    nodes: state.nodes
  };
};

const mapDispatchToProps = (dispatch): DagreActionCreators => {
  return {
    ...bindActionCreators({ ...dagreActionCreators }, dispatch) // FIXME
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Index);
