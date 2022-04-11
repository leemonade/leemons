/*
import { ImageLoader, Input } from 'leemons--ui';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, useHistory } from 'react-router-dom';

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
  state,
  setState,
}) {
  const history = useHistory();
  const key = `label-${item.id}`;
  const setNewLabel = (label) => {
    if (setState) setState({ [key]: label });
  };

  useEffect(() => {
    if (state && !state[key]) {
      setNewLabel(item.label);
    }
  }, []);

  const recalculeStyles = () => {
    const _styles = {
      color: 'text-secondary-content hover:text-secondary-content',
      border: '',
      backgroundColor: item.disabled ? '' : 'hover:bg-primary',
      paddings: 'pl-7 py-3 pr-8',
    };

    if (active) {
      _styles.backgroundColor = `bg-secondary-300 ${_styles.backgroundColor}`;
    }

    if (editMode) {
      _styles.color = 'text-neutral-content';
      _styles.backgroundColor = 'bg-base-200 hover:bg-base-100';
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
      _styles.border = `border ${
        state[key] ? 'border-primary' : 'border-error-focus'
      } border-solid`;
      _styles.backgroundColor = 'bg-base-200';
    }

    return `${_styles.color} ${_styles.border} ${_styles.backgroundColor} ${_styles.paddings}`;
  };

  const styles = recalculeStyles();

  const onClick = () => {
    if (!editMode && !editItemMode) {
      history.push(item.url);
    } else {
      changeToEditItem(item);
    }
  };

  const onNewLabelChange = (event) => {
    setNewLabel(event.target.value);
  };

  const onUpdateItem = () => {
    if (state[key]) {
      updateItem(item, { label: state[key] });
    }
  };

  if (!isLayer && !editMode && !editItemMode && !isDragging) {
    return (
      <Link
        to={item.url}
        className={`relative w-full block font-lexend text-sm ${styles} ${
          item.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
        }`}
        onClick={(e) => item.disabled && e.preventDefault()}
      >
        <span className="line-clamp-2">{item.label}</span>
      </Link>
    );
  }

  return (
    <div
      className={`relative w-full font-lexend text-sm cursor-pointer ${styles}`}
      style={isLayer ? { width: '190px' } : {}}
      onClick={onClick}
    >
      {(editMode || isLayer) && (
        <div
          className={`absolute left-2 top-2/4 transform -translate-y-1/2 hover:text-primary cursor-move ${
            isLayer ? 'text-primary' : ''
          }`}
          style={{ width: '10px', height: '5px' }}
        >
          <ImageLoader className="stroke-current" src={'/public/assets/svgs/re-order.svg'} />
        </div>
      )}
      {editItemMode ? (
        <div className="relative">
          <Input
            className="w-full pr-9"
            type="text"
            value={state[key]}
            onChange={onNewLabelChange}
            onKeyPress={(e) => e.key === 'Enter' && onUpdateItem()}
          />
          <div
            onClick={onUpdateItem}
            className={`absolute right-2 top-2/4 transform -translate-y-1/2 ${
              state[key] ? 'text-primary' : 'text-neutral'
            }`}
            style={{ width: '18px', height: '18px' }}
          >
            <ImageLoader className="fill-current" src={'/public/assets/svgs/check.svg'} />
          </div>
        </div>
      ) : (
        <span className={`line-clamp-2 hover:text-base-content`}>{item.label}</span>
      )}

      {editMode && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            remove(item);
          }}
          className="absolute right-3 top-2/4 transform -translate-y-1/2 hover:text-base-content"
          style={{ width: '12px', height: '12px' }}
        >
          <ImageLoader
            className="stroke-current fill-current"
            src={'/public/assets/svgs/remove.svg'}
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
  state: PropTypes.object,
  setState: PropTypes.func,
};
*/
