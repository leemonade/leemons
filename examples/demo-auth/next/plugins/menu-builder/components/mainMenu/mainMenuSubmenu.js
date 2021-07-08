import PropTypes from 'prop-types';
import MainMenuCloseSubmenuBtn from './mainMenuCloseSubmenuBtn';
import MainMenuSubmenuItem from './mainMenuSubmenuItem';
import MainMenuDropZone from './mainMenuDropZone';

export default function MainMenuSubmenu({ item, onClose, activeItem }) {
  return (
    <>
      {item && (
        <div className="w-full h-screen bg-gray-300 flex flex-col">
          {/* Header submenu */}
          <div className={'flex flex-row justify-between items-center mb-8 pt-3'}>
            <div className={'w-full pl-6 font-lexend text-base'}>Users</div>
            {/* Close submenu */}
            <div className={'px-2'}>
              <MainMenuCloseSubmenuBtn onClick={onClose} />
            </div>
          </div>
          {/* Items submenu */}
          <MainMenuDropZone className="h-full">
            {() => (
              <>
                {item.childrens.map((child) => (
                  <MainMenuSubmenuItem
                    key={child.id}
                    item={child}
                    active={activeItem?.id === child.id}
                  />
                ))}
              </>
            )}
          </MainMenuDropZone>
        </div>
      )}
    </>
  );
}

MainMenuSubmenu.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
  activeItem: PropTypes.object,
};
