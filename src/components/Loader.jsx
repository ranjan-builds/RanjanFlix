import React from 'react';
import { PulseLoader } from 'react-spinners';

const Loader = ({ loading, color = '#36d7b7', size = 15 }) => {
  return (
    <div style={styles.container}>
      <PulseLoader color={color} loading={loading} size={size} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

export default Loader;
