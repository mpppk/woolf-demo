import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WoolfView } from 'react-woolf';
import { IJobStat } from 'woolf';
import { JobFuncStat } from 'woolf/src/job';
import { woolfActionCreators } from '../../actions';
import { sampleSelectorActionCreators } from '../../actions/sampleSelector';
import AppBar from '../../components/AppBar';
import SampleSelector from '../../components/SampleSelector';
import StatTab from '../../components/StatTab';
import { State } from '../../reducer';
import { SampleName } from '../../services/samples/Samples';

// tslint:disable-next-line variable-name
const HelloWorld: React.FunctionComponent = () => {
  const state = useSelector((s: State) => s);
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.stats.length === 0) {
      dispatch(
        woolfActionCreators.requestToAssemble({ sampleName: state.sampleName })
      );
    }
  });

  const handleClickFuncNode = (jobStat: IJobStat, fs: JobFuncStat) => {
    dispatch(woolfActionCreators.updateCurrentStat({ jobStat, funcStat: fs }));
  };

  const handleClickJobNode = (jobStat: IJobStat) => {
    dispatch(woolfActionCreators.updateCurrentStat({ jobStat }));
  };

  const handleSampleSelectorChange = (selectedSampleName: SampleName) => {
    dispatch(sampleSelectorActionCreators.change({ selectedSampleName }));
  };

  const handleClickRunButton = () => {
    dispatch(woolfActionCreators.requestToRun({})); // FIXME
  };

  const funcStat = state.currentStat.funcStat;
  const code = funcStat && funcStat.Code ? funcStat.Code : '<empty>';
  return (
    <div>
      <AppBar />
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <SampleSelector
            currentSampleName={state.sampleName}
            sampleNames={state.availableSampleNames}
            onChange={handleSampleSelectorChange}
          />
        </Grid>
        <Grid item={true} xs={8}>
          <Paper>
            {state.stats.length > 0 && (
              <WoolfView
                width={('100%' as unknown) as number} // FIXME
                height={500}
                stats={state.stats}
                onClickFuncNode={handleClickFuncNode}
                onClickJobNode={handleClickJobNode}
                showInput={true}
                inputNodeLabel={JSON.stringify(state.runPayload)}
                outputNodeLabel={JSON.stringify(state.woolfResults)}
                showOutput={true}
              />
            )}
          </Paper>
        </Grid>
        <Grid item={true} xs={4}>
          <Paper>
            <StatTab
              code={code.toString()}
              funcStat={funcStat}
              jobStat={state.currentStat.jobStat}
              onClickTab={setTabValue}
              tabValue={tabValue}
            />
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleClickRunButton}>
        Run
      </Button>
    </div>
  );
};

export default HelloWorld;
