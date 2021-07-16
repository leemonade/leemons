import * as PropTypes from 'prop-types';

import LeemonsImage from '../leemonsImage';

export default function MainMenuItem({ item, menuWidth, active, onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        style={{ height: menuWidth }}
        className={`w-full text-center cursor-pointer ${
          active ? 'bg-secondary-400' : 'bg-secondary-500'
        } `}
        key={item.id}
      >
        <div className={'w-5 h-full mx-auto relative'}>
          <LeemonsImage
            className={`${
              active ? 'stroke-current text-white' : 'stroke-current text-secondary-50'
            }`}
            src={active && item.activeIconSvg ? item.activeIconSvg : item.iconSvg}
            alt={item.iconAlt}
          />
        </div>
      </div>
    </>
  );
}

MainMenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  menuWidth: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};
