import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import dynamic from 'next/dynamic';
import React from 'react';
import { connect } from 'react-redux';
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
import { WoolfStatView } from '../components/WoolfStatView';
import { WoolfView } from '../components/WoolfView';
import { State } from '../reducer';

// tslint:disable-next-line
const FunctionEditor = dynamic(import('../components/FunctionEditor'), {
  ssr: false
});

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
    const someJs = [
      "import {myCoolFunc} from './utils'",
      'export default async () => {',
      '  await myCoolFunc()',
      '}'
    ].join('\n');

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
        <WoolfStatView
          jobStat={this.props.currentStat.jobStat}
          funcStat={this.props.currentStat.funcStat}
        />
        <Button variant="contained" onClick={this.handleClickRunButton}>
          Run
        </Button>
        <FunctionEditor language="javascript" value={someJs} />
      </div>
    );
  }

  private async handleClickRunButton() {
    this.props.requestToRun();
  }
}

const mapStateToProps = (state: State): Partial<IndexProps> => {
  return {
    currentStat: state.currentStat,
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
