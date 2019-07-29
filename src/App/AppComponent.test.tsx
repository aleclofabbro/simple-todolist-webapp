import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppComponent';
import { EventEmitter } from 'events';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App emitter={new EventEmitter()} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
