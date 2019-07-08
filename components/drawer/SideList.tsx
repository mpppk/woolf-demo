import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from 'next/link';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4)
    },
    root: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 360,
      width: '100%'
    }
  })
);

// tslint:disable-next-line variable-name
const SideList: React.FunctionComponent = () => {
  const classes = useStyles(undefined);
  return (
    <List className={classes.root}>
      <Link href={'/'}>
        <ListItem button={true} key={'Home'}>
          <ListItemText primary={'Home'} />
        </ListItem>
      </Link>
      <Link href={'/about'}>
        <ListItem button={true} key={'About'}>
          <ListItemText primary={'About'} />
        </ListItem>
      </Link>
      <ListItem button={true} key={'Examples'}>
        <ListItemText primary={'Examples'} />
      </ListItem>
      <List component="div" disablePadding={true}>
        <Link href={'/examples/hello_world'}>
          <ListItem button={true} className={classes.nested}>
            <ListItemText primary="Hello World" />
          </ListItem>
        </Link>
      </List>
    </List>
  );
};

export default SideList;
