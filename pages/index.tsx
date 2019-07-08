import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '../components/AppBar';
export default () => (
  <div>
    <AppBar />
    <Typography variant="h2" gutterBottom={true}>
      Woolf
    </Typography>
    Woolf is the <b>Universal</b> Workflow Engine like AWS Step Functions.
    <br />
    Universal means that Woolf can work on
    <br />
    * browser
    <br />
    * Nodejs
    <br />
    * AWS Lambda (of course!)
    <br />
  </div>
);
