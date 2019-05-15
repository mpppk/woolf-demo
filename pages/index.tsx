import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
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
import Grid from '@material-ui/core/Grid';

// tslint:disable-next-line
const FunctionEditor = dynamic(import('../components/FunctionEditor'), {
  ssr: false
});

type IndexProps = {
  stats: IJobStat[];
  currentStat: IUpdateCurrentStatPayload;
} & WoolfActionCreators;

interface IndexState {
  tabValue: 0;
}

class Index extends React.Component<IndexProps, IndexState> {
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
    this.handleClickTab = this.handleClickTab.bind(this);
    this.state = { tabValue: 0 };
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

    const handleClickCode = func => {
      func();
    };

    // @ts-ignore
    return (
      <div>
        <AppBar />
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={8}>
            <Paper>
              <WoolfView
                width={800}
                height={500}
                stats={this.props.stats}
                onClickFuncNode={this.handleClickFuncNode}
                onClickJobNode={this.handleClickJobNode}
              />
            </Paper>
          </Grid>
          <Grid item={true} xs={4}>
            <Paper>
              <Tabs value={this.state.tabValue} onChange={this.handleClickTab}>
                <Tab label="Info" />
                <Tab label="Code" />
              </Tabs>
              {this.state.tabValue === 0 && (
                <WoolfStatView
                  jobStat={this.props.currentStat.jobStat}
                  funcStat={this.props.currentStat.funcStat}
                  onClickCode={handleClickCode}
                />
              )}
              {this.state.tabValue === 1 && (
                <FunctionEditor language="javascript" value={someJs} />
              )}
            </Paper>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={this.handleClickRunButton}>
          Run
        </Button>
      </div>
    );
  }

  private async handleClickRunButton() {
    this.props.requestToRun();
  }

  private handleClickTab(_event: React.ChangeEvent<{}>, tabValue: any) {
    this.setState({ ...this.state, tabValue });
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
