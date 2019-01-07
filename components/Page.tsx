import Typography from '@material-ui/core/Typography/Typography';
import { connect } from 'react-redux';
import AppBar from './AppBar';
import DagreD3 from './Dagre';

const nodes = {
  '1': {
    label: 'Node 1'
  },
  '2': {
    label: 'Node 2'
  },
  '3': {
    label: 'Node 3'
  },
  '4': {
    label: 'Node 4'
  }
};

const edges: Array<[string, string, {}]> = [
  ['1', '2', {}],
  ['1', '3', {}],
  ['2', '4', {}],
  ['3', '4', {}]
];

function Page({ title }) {
  return (
    <div>
      <AppBar />
      <Typography variant="h2" gutterBottom={true}>
        {title}
      </Typography>
      <DagreD3
        nodes={nodes}
        edges={edges}
      />
      {/*<Counter />*/}
    </div>
  );
}

export default connect(state => state)(Page);
