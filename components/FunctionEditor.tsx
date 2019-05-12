import * as React from 'react';
import MonacoEditor from './Monaco';

export default _props => {
  const nullHandler = () => null;

  const options = {
    automaticLayout: false,
    cursorStyle: 'line',
    readOnly: false,
    roundedSelection: false,
    selectOnLineNumbers: true
  };

  return (
    <MonacoEditor
      width={500}
      height={200}
      language="javascript"
      theme="vs-dark"
      value="console.log('hoge');"
      options={options}
      onChange={nullHandler}
      editorDidMount={nullHandler}
      editorWillMount={nullHandler}
    />
  );
};
