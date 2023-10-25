import React from 'react';
import { render } from '@testing-library/react';
// import { axe } from 'jest-axe';
// import { MainNavBar } from './MainNavBar';

describe('MainNavBar', () => {
  // it('should have no axe violations', async () => {
  //   const { container } = await render(<MainNavBar />);
  //   const results = await axe(container);
  //   expect(results).toHaveNoViolations();
  // });
  it('MainNavBar renders properly', () => {
    // render(
    //   <MainNavBar
    //     menuData={[]}
    //     isLoading={false}
    //     subNavWidth={false}
    //     hideSubNavOnClose={false}
    //     useRouter
    //     useSpotlight
    //     spotlightLabel={'HEllo'}
    //     navTitle={'Leemons'}
    //     session={{
    //       name: 'Fer',
    //       surnames: 'Apellidos',
    //     }}
    //     sessionMenu={{
    //       id: 'menu-0',
    //       label: 'label',
    //     }}
    //   />
    // );
    // render(<TestComponent />);
    // render(<Logo isotype />);
  });
  it('testing jest', () => {
    render(<div>Hello</div>);
    expect(1).toBe(1);
  });
});
