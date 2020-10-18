import React from 'react';
import { render } from '@testing-library/react';
import SignUp from '../components/screens/signup';

test('sign up test', () => {
  const { getAllByText } = render(<SignUp />);
  const linkElement = getAllByText(/Sign Up/i);
  var x;
  for (x of linkElement) {
    expect(x).toBeInTheDocument();
  }
});
