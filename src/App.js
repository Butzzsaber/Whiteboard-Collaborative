import React, { useEffect } from 'react';
import Whiteboard from './Whiteboard/Whiteboard';
import { connectedWithSocketServer } from './socketconn/socketConn';

function App() {
 
  return (
    <div>
      <Whiteboard />
    </div>
  );
}

export default App;
