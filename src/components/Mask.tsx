import React from 'react';

export const Mask: React.FC<{ show: boolean }> = ({ show }) => {

  return (
    <div style={{
      display: show ? 'block' : 'none',
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(100,100,100,0.3)'
    }}>
      <div style={{ marginLeft: '50%' }} className={`float-left fa-2x fas fa-spinner fa-spin`}></div>
    </div >
  );
}
