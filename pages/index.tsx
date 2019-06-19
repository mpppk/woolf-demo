import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import { connect } from 'react-redux';
import { WoolfView } from 'react-woolf';
import { bindActionCreators, Dispatch } from 'redux';
import { JobFuncStat } from 'woolf/src/job';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import { IUpdateCurrentStatPayload, woolfActionCreators } from '../actions';
import {
  SampleSelectorActionCreators,
  sampleSelectorActionCreators
} from '../actions/sampleSelector';
import AppBar from '../components/AppBar';
import SampleSelector from '../components/SampleSelector';
import StatTab from '../components/StatTab';
import { State } from '../reducer';
import { SampleName } from '../services/samples/Samples';

type IndexProps = {
  availableSampleNames: SampleName[];
  stats: IJobStat[];
  currentStat: IUpdateCurrentStatPayload;
  sampleName: SampleName;
} & ReturnType<typeof mapDispatchToProps> &
  SampleSelectorActionCreators;

interface IndexState {
  tabValue: 0;
}

class Index extends React.Component<IndexProps, IndexState> {
  // tslint:disable-next-line member-access
  static async getInitialProps(props) {
    const { isServer } = props.ctx;
    return { isServer };
  }

  constructor(props) {
    super(props);
    this.handleClickRunButton = this.handleClickRunButton.bind(this);
    this.handleClickFuncNode = this.handleClickFuncNode.bind(this);
    this.handleClickJobNode = this.handleClickJobNode.bind(this);
    this.handleClickStatTab = this.handleClickStatTab.bind(this);
    this.handleSampleSelectorChange = this.handleSampleSelectorChange.bind(
      this
    );
    this.state = { tabValue: 0 };
  }

  // tslint:disable-next-line member-access
  componentDidMount(): void {
    this.props.requestToRun();
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
  handleSampleSelectorChange(selectedSampleName: SampleName) {
    this.props.change({ selectedSampleName });
  }

  // tslint:disable-next-line member-access
  render() {
    const funcStat = this.props.currentStat.funcStat;
    const code = funcStat && funcStat.Code ? funcStat.Code : '<empty>';

    // @ts-ignore
    return (
      <div>
        <AppBar />
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={12}>
            <SampleSelector
              currentSampleName={this.props.sampleName}
              sampleNames={this.props.availableSampleNames}
              onChange={this.handleSampleSelectorChange}
            />
          </Grid>
          <Grid item={true} xs={8}>
            <Paper>
              {this.props.stats.length > 0 && (
                <WoolfView
                  width={800}
                  height={500}
                  stats={this.props.stats}
                  onClickFuncNode={this.handleClickFuncNode}
                  onClickJobNode={this.handleClickJobNode}
                />
              )}
            </Paper>
          </Grid>
          <Grid item={true} xs={4}>
            <Paper>
              <StatTab
                code={code.toString()}
                funcStat={funcStat}
                jobStat={this.props.currentStat.jobStat}
                onClickTab={this.handleClickStatTab}
                tabValue={this.state.tabValue}
              />
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

  private handleClickStatTab(tabValue: any) {
    this.setState({ ...this.state, tabValue });
  }
}

const mapStateToProps = (state: State): Partial<IndexProps> => {
  return {
    availableSampleNames: state.availableSampleNames,
    currentStat: state.currentStat,
    sampleName: state.sampleName,
    stats: state.stats
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators(
      {
        ...woolfActionCreators,
        ...sampleSelectorActionCreators
      },
      dispatch
    ) // FIXME
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
