import React from 'react';
import { render } from '@testing-library/react';
import SocialFeed from '../components/socialfeed';

test('John Doe social feed loads', () => {
  const { getByText } = render(<SocialFeed />);
  const linkElement = getByText(/John Doe/i);
  expect(linkElement).toBeInTheDocument();
});
