import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Input from './Input';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/outline';

function PageHeader({
  className,
  breadcrumbs,
  title,
  titlePlaceholder,
  description,
  canEditTitle,
  onTitleChange,
  newButton,
  saveButton,
  cancelButton,
  duplicateButton,
  editButton,
  onNewButton,
  onSaveButton,
  onCancelButton,
  onDuplicateButton,
  onEditButton,
  onButton,
}) {
  const getBreadcrumbs = () => {
    if (breadcrumbs) {
      return (
        <div className="mb-6">
          {breadcrumbs.map((breadcrumb, i) => (
            <span key={i} className="text-sm text-neutral-content">
              <span className={`${i + 1 === breadcrumbs.length ? 'text-secondary' : ''}`}>
                {breadcrumb}
              </span>
              {i + 1 < breadcrumbs.length ? (
                <ChevronRightIcon className="mx-1 w-3 h-3 inline" />
              ) : null}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (canEditTitle) {
      return (
        <div>
          <Input
            className="w-full input-lg"
            outlined={true}
            placeholder={titlePlaceholder}
            onChange={(e) => {
              if (_.isFunction(onTitleChange)) onTitleChange(e);
            }}
          />
        </div>
      );
    }
    return <div className="text-2xl text-secondary">{title}</div>;
  };

  const getDescription = () => {
    if (description) {
      return <div className="text-base text-secondary mt-2">{description}</div>;
    }
    return null;
  };

  const onPressButton = (btnFunction) => {
    if (_.isFunction(btnFunction)) {
      btnFunction();
    }
    if (_.isFunction(onButton)) {
      onButton();
    }
  };

  const getButtons = () => {
    // TODO Ver con johan de donde sacar las traducciones
    const buttons = [];

    if (cancelButton) {
      buttons.push(
        <Button
          key="cancel-btn"
          color="ghost"
          className="text-primary"
          onClick={() => onPressButton(onCancelButton)}
        >
          Cancel
        </Button>
      );
    }
    if (duplicateButton) {
      buttons.push(
        <Button
          key="duplicate-btn"
          color="primary"
          outlined={true}
          onClick={() => onPressButton(onDuplicateButton)}
        >
          Duplicate
        </Button>
      );
    }
    if (editButton) {
      buttons.push(
        <Button key="edit-btn" color="primary" onClick={() => onPressButton(onEditButton)}>
          Edit
        </Button>
      );
    }
    if (saveButton) {
      buttons.push(
        <Button key="save-btn" color="primary" onClick={() => onPressButton(onSaveButton)}>
          Save
        </Button>
      );
    }
    if (newButton) {
      buttons.push(
        <Button key="new-btn" color="secondary" onClick={() => onPressButton(onNewButton)}>
          <PlusIcon className="w-6 h-6 mr-1" />
          New
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  return (
    <div className={`${className} bg-primary-content p-6 border-b border-base-300`}>
      <div className="max-w-screen-xl w-full">
        {getBreadcrumbs()}
        <div className="flex flex-row items-center">
          <div className="flex-grow">
            {getTitle()}
            {getDescription()}
          </div>
          <div className="flex flex-row space-x-2">{getButtons()}</div>
        </div>
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  className: PropTypes.string,
  breadcrumbs: PropTypes.array,
  title: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  description: PropTypes.string,
  canEditTitle: PropTypes.bool,
  onTitleChange: PropTypes.func,
  newButton: PropTypes.bool,
  saveButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  duplicateButton: PropTypes.bool,
  editButton: PropTypes.bool,
  onNewButton: PropTypes.func,
  onSaveButton: PropTypes.func,
  onCancelButton: PropTypes.func,
  onDuplicateButton: PropTypes.func,
  onEditButton: PropTypes.func,
  onButton: PropTypes.func,
};

export default PageHeader;
