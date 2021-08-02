import { Button, ImageLoader } from 'leemons-ui';
import * as PropTypes from 'prop-types';

export default function MainMenuCloseSubmenuBtn({ onClick }) {
  return (
    <>
      <Button color="secondary" circle onClick={onClick} className="btn-sm">
        <div className={'w-4 h-full mx-auto relative'}>
          {/* TODO: Add alt multilanguage */}
          <ImageLoader
            className="stroke-current text-secondary-content"
            src="/assets/svgs/keyboard-previous.svg"
          />
        </div>
      </Button>
    </>
  );
}

MainMenuCloseSubmenuBtn.propTypes = {
  onClick: PropTypes.func,
};
