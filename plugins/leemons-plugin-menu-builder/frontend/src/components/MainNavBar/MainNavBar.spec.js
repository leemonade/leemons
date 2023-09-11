// import React from 'react';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import { MainNavBar } from './MainNavBar';

describe('MainNavBar', () => {
  it('should have no axe violations', async () => {
    const { container } = render(<MainNavBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
