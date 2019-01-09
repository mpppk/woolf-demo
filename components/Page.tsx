import Typography from '@material-ui/core/Typography/Typography';
import { connect } from 'react-redux';
import AppBar from './AppBar';
// import DagreD3 from './Dagre';
import Dagre2 from './Dagre2';
import LineChart from './LineChart';
const data =[
  [{x: 0, y: 6},{x: 1, y: 9},{x: 2, y: 6},
    {x: 3, y: 5},{x: 4, y: 2},{x: 6, y: 4},
    {x: 7, y: 2},{x: 8, y: 5},{x: 9, y: 2}]
];
function Page({ title }) {
  return (
    <div>
      <AppBar />
      <Typography variant="h2" gutterBottom={true}>
        {title}
      </Typography>
      <LineChart data={data}/>
      <Dagre2/>
    </div>
  );
}

export default connect(state => state)(Page);
