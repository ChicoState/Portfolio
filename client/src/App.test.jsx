import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('home screen loads', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Response from API:/i);
  expect(linkElement).toBeInTheDocument();
});
