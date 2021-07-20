import * as PropTypes from 'prop-types';
import { Button, Tooltip } from 'leemons-ui';
import LeemonsImage from '../leemonsImage';

export default function MainMenuItem({ item, menuWidth, active, onClick }) {
  return (
    <>
      <Tooltip color="primary" position="right" content="Im large" open={true}>
        <Button
          onClick={onClick}
          style={{ height: menuWidth }}
          color="secondary"
          className={`w-full text-center cursor-pointer hover:bg-primary-focus ${
            active ? 'bg-secondary-focus' : ''
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
        </Button>
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
