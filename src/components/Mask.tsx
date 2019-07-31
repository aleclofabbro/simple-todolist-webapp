import React from 'react';

export const Mask: React.FC<{ show: boolean }> = ({ show }) => {

  return (
    <div className="col-12" style={{
      display: show ? 'block' : 'none',
      position: 'fixed',
      top: '0px',
      left: '0',
      right: '0',
      backgroundColor: 'rgba(100, 100, 100, 0.3)',
      zIndex: 999,
      padding: '0',
      margin: '0',
      bottom: '0'
    }}>
      <div style={{ marginLeft: '50%', marginTop: '50%' }} className={`float-left fa-4x fas fa-spinner fa-spin`}></div>
    </div >
  );
}
