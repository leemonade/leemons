// import React from 'react';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import { MainNavBar } from './MainNavBar';

describe('MainNavBar', () => {
  // it('should have no axe violations', async () => {
  //   const { container } = render(<MainNavBar />);
  //   const results = await axe(container);
  //   expect(results).toHaveNoViolations();
  // });
  it('MainNavBar renders properly', () => {
    render(
      <MainNavBar
        menuData={[]}
        isLoading={false}
        subNavWidth={false}
        hideSubNavOnClose={false}
        useRouter
        useSpotlight
        spotlightLabel={'HEllo'}
        navTitle={'Leemons'}
        session={{
          name: 'Fer',
          surnames: 'Apellidos',
        }}
        sessionMenu={{
          id: 'menu-0',
          label: 'label',
        }}
      />
    );
  });
});
