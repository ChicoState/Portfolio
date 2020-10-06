import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = ReactDOM.render(
    <BrowserRouter>
      <div>
        <App />
      </div>
    </BrowserRouter>,
  );
  const linkElement = getByText(/Learn React/i);
  expect(linkElement).toBeInTheDocument();
});
