import { Tab, Tabs } from '@material-ui/core';
import dynamic from 'next-server/dynamic';
import { FunctionComponent } from 'react';
import { WoolfStatView } from 'react-woolf';
import { IJobStat } from 'woolf';
import { JobFuncStat } from 'woolf/src/job';

// tslint:disable-next-line
const FunctionEditor = dynamic(import('./FunctionEditor'), {
  ssr: false
});

export interface StatTabProps {
  jobStat: IJobStat;
  funcStat: JobFuncStat;
  tabValue: number;
  onClickTab: (tabValue: number) => void;
  code: string;
}

// tslint:disable-next-line variable-name
const StatTab: FunctionComponent<StatTabProps> = props => {
  const handleClickTab = (_event: React.ChangeEvent<{}>, tabValue: any) => {
    props.onClickTab(tabValue);
  };
  return (
    <div>
      <Tabs value={props.tabValue} onChange={handleClickTab}>
        <Tab label="Info" />
        <Tab label="Code" />
      </Tabs>
      {props.tabValue === 0 && (
        <WoolfStatView jobStat={props.jobStat} funcStat={props.funcStat} />
      )}
      {props.tabValue === 1 && (
        <FunctionEditor
          theme="vs-dark"
          language="javascript"
          value={props.code.toString()}
        />
      )}
    </div>
  );
};

export default StatTab;
