/*
import React from 'react';
import { render } from '@testing-library/react';
import Login from '../components/screens/Login';

test('login test', () => {
  const { getByText } = render(<Login />);
  const linkElement = getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
*/

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});