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
import AppBar from '../../components/AppBar';
import StatTab from '../../components/StatTab';
import { State } from '../../reducer';

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
          <Button variant="contained" onClick={handleClickRunButton}>
            Run
          </Button>
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
    </div>
  );
};

export default HelloWorld;
