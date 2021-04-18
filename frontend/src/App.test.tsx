import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('some dummy test', () => {
  render(<App />);
  // const linkElement = screen.getByText('GameBoard');
  // expect(linkElement).toBeInTheDocument();
});
