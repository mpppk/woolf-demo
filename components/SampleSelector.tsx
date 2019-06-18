import { createStyles, FormControl, Theme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { SampleName } from '../reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
);

interface SampleSelectorProps {
  currentSampleName: SampleName;
  sampleNames: SampleName[];
  onChange: (value: unknown) => void;
}

interface MenuItemProps {
  value: any;
  name: string;
}

const sampleNamesToMenuItems = (sampleNames: SampleName[]) => {
  const items = sampleNames.map(sampleName => ({
    name: sampleName.toString(),
    value: sampleName.toString()
  }));
  return toMenuItems(items);
};

const toMenuItems = (items: MenuItemProps[]) => {
  return items.map(item => {
    return (
      <MenuItem key={item.value} value={item.value}>
        {item.name}
      </MenuItem>
    );
  });
};

// tslint:disable-next-line variable-name
const SampleSelector: FunctionComponent<SampleSelectorProps> = props => {
  const classes = useStyles(undefined);
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    props.onChange(event.target.value);
  };

  return (
    <div>
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="sample-selector">Sample</InputLabel>
          <Select
            value={props.currentSampleName}
            onChange={handleChange}
            inputProps={{
              id: 'sample-selector',
              name: 'Sample'
            }}
          >
            {sampleNamesToMenuItems(props.sampleNames)}
          </Select>
        </FormControl>
      </form>
    </div>
  );
};

export default SampleSelector;
