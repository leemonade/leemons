import { Input } from 'leemons-ui';
import Link from 'next/link';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import LeemonsImage from '../leemonsImage';

export default function MainMenuSubmenuItem({
  item,
  active,
  isDragging,
  isLayer,
  editMode,
  editItemMode,
  changeToEditItem,
  updateItem,
  remove,
}) {
  const [newLabel, setNewLabel] = useState(item.label);

  const recalculeStyles = () => {
    const _styles = {
      color: 'text-secondary-content hover:text-secondary-content',
      border: '',
      backgroundColor: 'hover:bg-primary',
      paddings: 'pl-7 py-3 pr-8',
    };

    if (active) {
      _styles.backgroundColor = `bg-secondary-300 ${_styles.backgroundColor}`;
    }

    if (isDragging) {
      _styles.border = 'border border-secondary-content border-dashed';
    }

    if (isLayer) {
      _styles.color = 'text-secondary';
      _styles.border = 'border border-primary border-dashed';
      _styles.backgroundColor = 'bg-secondary-content';
    }

    if (editItemMode) {
      _styles.paddings = 'px-1 py-1';
      _styles.border = `border ${newLabel ? 'border-primary' : 'border-error-focus'} border-solid`;
      _styles.backgroundColor = 'bg-base-200';
    }

    return `${_styles.color} ${_styles.border} ${_styles.backgroundColor} ${_styles.paddings}`;
  };

  const styles = recalculeStyles();

  const onClick = () => {
    if (!editMode && !editItemMode) {
      Router.push(item.url);
    } else {
      changeToEditItem(item);
    }
  };

  const onNewLabelChange = (event) => {
    setNewLabel(event.target.value);
  };

  const onUpdateItem = () => {
    if (newLabel) {
      updateItem(item, { label: newLabel });
    }
  };

  if (!isLayer && !editMode && !editItemMode && !isDragging) {
    return (
      <Link href={item.url}>
        <a className={`relative w-full block font-lexend text-sm cursor-pointer ${styles}`}>
          <span className="line-clamp-2">{item.label}</span>
        </a>
      </Link>
    );
  }

  return (
    <div
      className={`relative w-full font-lexend text-sm cursor-pointer ${styles}`}
      style={isLayer ? { width: '190px' } : {}}
      onClick={onClick}
    >
      {editMode && (
        <div
          className="absolute left-2 top-2/4 transform -translate-y-1/2"
          style={{ width: '10px', height: '5px' }}
        >
          <LeemonsImage className="stroke-current" src={'/menu-builder/svgs/re-order.svg'} />
        </div>
      )}
      {editItemMode ? (
        <div className="relative">
          <Input
            className="w-full pr-9"
            type="text"
            value={newLabel}
            onChange={onNewLabelChange}
            onKeyPress={(e) => e.key === 'Enter' && onUpdateItem()}
          />
          <div
            onClick={onUpdateItem}
            className={`absolute right-2 top-2/4 transform -translate-y-1/2 ${
              newLabel ? 'text-primary' : 'text-neutral'
            }`}
            style={{ width: '18px', height: '18px' }}
          >
            <LeemonsImage className="fill-current" src={'/menu-builder/svgs/check.svg'} />
          </div>
        </div>
      ) : (
        <span className={`line-clamp-2`}>{item.label}</span>
      )}

      {editMode && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            remove(item);
          }}
          className="absolute right-3 top-2/4 transform -translate-y-1/2"
          style={{ width: '12px', height: '12px' }}
        >
          <LeemonsImage
            className="stroke-current fill-current"
            src={'/menu-builder/svgs/remove.svg'}
          />
        </div>
      )}
    </div>
  );
}

MainMenuSubmenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
  isDragging: PropTypes.bool,
  isLayer: PropTypes.bool,
  editMode: PropTypes.bool,
  editItemMode: PropTypes.bool,
  remove: PropTypes.func,
  changeToEditItem: PropTypes.func,
  updateItem: PropTypes.func,
};
