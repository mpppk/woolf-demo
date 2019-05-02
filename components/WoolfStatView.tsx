import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { IJobStat } from 'woolf';
import { JobFuncStat } from 'woolf/src/job';

interface IWoolfStatProps {
  jobStat: IJobStat;
  funcStat: JobFuncStat;
}

export class WoolfStatView extends React.Component<IWoolfStatProps> {
  constructor(props) {
    super(props);
  }

  // tslint:disable-next-line member-access
  render() {
    return (
      <Paper>
        <Table>
          <TableBody>
            <TableRow key={0}>
              <TableCell component="th" scope="row">
                Job Name
              </TableCell>
              <TableCell component="th" scope="row">
                target-job
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
