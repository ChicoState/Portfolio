import React from 'react';
import { render } from '@testing-library/react';
import Login from '../components/screens/login';

test('login test', () => {
  const { getByText } = render(<Login />);
  const linkElement = getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
