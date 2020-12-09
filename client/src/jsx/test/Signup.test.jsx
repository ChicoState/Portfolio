/* import React from 'react';
import { render } from '@testing-library/react';
import SignUp from '../components/screens/Signup';

test('sign up test', () => {
  const { getAllByText } = render(<SignUp />);
  const linkElement = getAllByText(/Sign Up/i);
  var x;
  for (x of linkElement) {
    expect(x).toBeInTheDocument();
  }
});
*/

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
