import Image from 'next/image';
import * as PropTypes from 'prop-types';

export default function MainMenuItem({ item, menuWidth, active, onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        style={{ height: menuWidth }}
        className={`w-full text-center cursor-pointer ${active ? 'bg-gray-600' : 'bg-gray-200'} `}
        key={item.id}
      >
        <div className={'w-5 h-full mx-auto relative'}>
          <Image
            layout="fill"
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
