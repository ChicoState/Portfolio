/*
import React from 'react';
import { render } from '@testing-library/react';
import NavigationBar from '../components/NavigationBar';

test('navbar renders', () => {
  const { getByText } = render(<NavigationBar />);
  const linkElement = getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});
*/

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
