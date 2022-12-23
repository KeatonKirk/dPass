import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import Account from './components/Account'

test('renders homepage text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders account page text', () => {
  render(<Account/>);
  const linkElement = screen.getByText(/Account/)
  expect(linkElement).toBeInTheDocument();
})
