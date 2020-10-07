import React from 'react';
import { render } from '@testing-library/react';
import NavigationBar from '../components/navigationbar';

test('navbar renders', () => {
  const { getByText } = render(<NavigationBar />);
  const linkElement = getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});
