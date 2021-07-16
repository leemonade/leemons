import * as PropTypes from 'prop-types';
import LeemonsImage from '../leemonsImage';

const closeSubmenuSize = '32px';

export default function MainMenuCloseSubmenuBtn({ onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        style={{ width: closeSubmenuSize, height: closeSubmenuSize }}
        className={'bg-secondary-500 rounded-full cursor-pointer'}
      >
        <div className={'w-4 h-full mx-auto relative'}>
          {/* TODO: Add alt multilanguage */}
          <LeemonsImage
            className="stroke-current text-secondary-20"
            src="/menu-builder/svgs/keyboard-previous.svg"
          />
        </div>
      </div>
    </>
  );
}

MainMenuCloseSubmenuBtn.propTypes = {
  onClick: PropTypes.func,
};
