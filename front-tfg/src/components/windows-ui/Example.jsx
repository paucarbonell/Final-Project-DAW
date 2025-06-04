import React from 'react';
import Window from './Window';
import Button from './Button';

const Example = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Window 
        title="Windows UI Example" 
        width="400px" 
        height="300px"
        onClose={() => console.log('Window closed')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>Windows UI Components</h3>
          <p>This is an example of the Windows UI components.</p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => console.log('Button clicked')}>
              Normal Button
            </Button>
            
            <Button outlined onClick={() => console.log('Outlined button clicked')}>
              Outlined Button
            </Button>
            
            <Button disabled>
              Disabled Button
            </Button>
          </div>
        </div>
      </Window>
    </div>
  );
};

export default Example; 