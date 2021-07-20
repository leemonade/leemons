import * as PropTypes from 'prop-types';
import LeemonsImage from '../leemonsImage';
import { Tooltip } from 'leemons-ui';

export default function MainMenuItem({ item, menuWidth, active, onClick }) {
  return (
    <>
      <Tooltip
        onClick={onClick}
        style={{ height: menuWidth }}
        className={`tooltip-open tooltip-lg sharp w-full text-center cursor-pointer ${
          active ? 'bg-secondary-focus' : 'bg-secondary'
        } `}
        color="primary"
        position="right"
        content="Im large"
      >
        <button
          onClick={onClick}
          style={{ height: menuWidth }}
          className={`w-full text-center cursor-pointer ${
            active ? 'bg-secondary-focus' : 'bg-secondary'
          } `}
        >
          <div className={'w-5 h-full mx-auto relative'}>
            <LeemonsImage
              className={`${
                active
                  ? 'stroke-current text-secondary-content'
                  : 'stroke-current text-secondary-content'
              }`}
              src={active && item.activeIconSvg ? item.activeIconSvg : item.iconSvg}
              alt={item.iconAlt}
            />
          </div>
        </button>
      </Tooltip>
    </>
  );
}

MainMenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  menuWidth: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};
