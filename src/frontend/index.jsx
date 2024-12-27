import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Button } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  const handleClick = () => {
    alert('Primary button clicked!');
  };

  return (
    <>
      <Text>DevTools.</Text>
      <Text>{data ? data : 'Loading...'}</Text>
      <Button appearance="primary" onClick={handleClick}>
        Primary Button
      </Button>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
