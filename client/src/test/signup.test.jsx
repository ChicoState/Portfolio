import React from 'react';
import { render } from '@testing-library/react';
import SignUp from '../components/screens/signup';

test('sign up test', () => {
  const { getByText } = render(<SignUp />);
  const linkElement = getByText(/Sign Up/i);
  expect(linkElement).toBeInTheDocument();
});
