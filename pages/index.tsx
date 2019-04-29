import React from 'react';
import { connect } from 'react-redux';

import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import { bindActionCreators } from 'redux';
import { JobFuncStat } from 'woolf/src/job';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import {
  counterActionCreators,
  IUpdateCurrentStatPayload,
  WoolfActionCreators,
  woolfActionCreators
} from '../actions';
import AppBar from '../components/AppBar';
import { WoolfView } from '../components/WoolfView';
import { State } from '../reducer';

type IndexProps = {
  stats: IJobStat[];
  currentStat: IUpdateCurrentStatPayload;
} & WoolfActionCreators;

class Index extends React.Component<IndexProps> {
  // tslint:disable-next-line member-access
  static async getInitialProps(props) {
    const { store, isServer } = props.ctx;
    store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
    return { isServer };
  }

  constructor(props) {
    super(props);
    this.handleClickRunButton = this.handleClickRunButton.bind(this);
    this.handleClickFuncNode = this.handleClickFuncNode.bind(this);
    this.handleClickJobNode = this.handleClickJobNode.bind(this);
  }

  // tslint:disable-next-line member-access
  handleClickFuncNode(jobStat: IJobStat, funcStat: JobFuncStat) {
    this.props.updateCurrentStat({ jobStat, funcStat });
  }

  // tslint:disable-next-line member-access
  handleClickJobNode(jobStat: IJobStat) {
    this.props.updateCurrentStat({ jobStat });
  }

  // tslint:disable-next-line member-access
  render() {
    return (
      <div>
        <AppBar />
        <Typography variant="h2" gutterBottom={true}>
          Index Page
        </Typography>
        <WoolfView
          width={800}
          height={500}
          stats={this.props.stats}
          onClickFuncNode={this.handleClickFuncNode}
          onClickJobNode={this.handleClickJobNode}
        />
        <Button variant="contained" onClick={this.handleClickRunButton}>
          Run
        </Button>
      </div>
    );
  }

  private async handleClickRunButton() {
    // console.log('handleClickRunButton');

    this.props.requestToRun();
  }
  // private onDagreDidMount = () => {
  //   this.props.updateStats({
  //
  //   });
  // };
}

const mapStateToProps = (state: State): Partial<IndexProps> => {
  return {
    stats: state.stats
  };
};

const mapDispatchToProps = (dispatch): WoolfActionCreators => {
  return {
    ...bindActionCreators({ ...woolfActionCreators }, dispatch) // FIXME
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
