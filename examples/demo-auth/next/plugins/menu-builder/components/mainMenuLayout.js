import PropTypes from 'prop-types';
import MainMenu from './mainMenu';
import { useState } from 'react';
import DndLayer from './dnd/dndLayer';

export default function MainMenuLayout({ children }) {
  const [menuWidth, setMenuWidth] = useState(52);

  function onCloseMenu() {
    setMenuWidth(52);
  }

  function onOpenMenu() {
    setMenuWidth(242);
  }

  return (
    <>
      <div className={'flex'}>
        <DndLayer />
        <div style={{ width: `${menuWidth}px` }} className={'overflow-x-hidden transition-all'}>
          <MainMenu onClose={onCloseMenu} onOpen={onOpenMenu} />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}

MainMenuLayout.propTypes = {
  children: PropTypes.node,
};
