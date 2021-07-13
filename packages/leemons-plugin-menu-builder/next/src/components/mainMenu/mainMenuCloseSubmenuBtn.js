import Image from 'next/image';
import * as PropTypes from 'prop-types';

const closeSubmenuSize = '32px';

export default function MainMenuCloseSubmenuBtn({ onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        style={{ width: closeSubmenuSize, height: closeSubmenuSize }}
        className={'bg-gray-400 rounded-full cursor-pointer'}
      >
        <div className={'w-4 h-full mx-auto relative'}>
          {/* TODO: Add alt multilanguage */}
          <Image layout="fill" src="/menu-builder/svgs/keyboard-previous.svg" />
        </div>
      </div>
    </>
  );
}

MainMenuCloseSubmenuBtn.propTypes = {
  onClick: PropTypes.func,
};
