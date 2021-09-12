import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Input from './Input';
import { ChevronRightIcon, PlusIcon, CloudUploadIcon } from '@heroicons/react/outline';
import FormControl from './FormControl';

function PageHeader({
  className,
  breadcrumbs,
  title,
  titlePlaceholder,
  description,
  registerFormTitle,
  registerFormTitleErrors,
  newButton,
  saveButton,
  cancelButton,
  importFamiliesButton,
  duplicateButton,
  editButton,
  newButtonLoading,
  saveButtonLoading,
  cancelButtonLoading,
  duplicateButtonLoading,
  importFamiliesButtonLoading,
  editButtonLoading,
  onNewButton,
  onSaveButton,
  onCancelButton,
  onDuplicateButton,
  onEditButton,
  onButton,
  separator
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
    if (registerFormTitle) {
      return (
        <div>
          <FormControl formError={registerFormTitleErrors}>
            <Input
              className="w-full input-lg"
              outlined={true}
              placeholder={titlePlaceholder}
              {...registerFormTitle}
            />
          </FormControl>
        </div>
      );
    }
    return <div className="text-2xl text-secondary">{title}</div>;
  };

  const getDescription = () => {
    if (description) {
      return (
        <div
          className="text-base text-secondary mt-2"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      );
    }
    return null;
  };

  const onPressButton = (btnFunction, e) => {
    if (_.isFunction(btnFunction)) {
      btnFunction(e);
    }
    if (_.isFunction(onButton)) {
      onButton(e);
    }
  };

  const getButtons = () => {
    const buttons = [];

    if (cancelButton) {
      buttons.push(
        <Button
          key="cancel-btn"
          color="primary"
          className="text-primary"
          loading={cancelButtonLoading}
          type="button"
          text
          onClick={(e) => onPressButton(onCancelButton, e)}
        >
          {_.isString(cancelButton) ? cancelButton : 'Cancel'}
        </Button>
      );
    }
    if (duplicateButton) {
      buttons.push(
        <Button
          key="duplicate-btn"
          color="primary"
          outlined={true}
          type="button"
          loading={duplicateButtonLoading}
          onClick={(e) => onPressButton(onDuplicateButton, e)}
        >
          {_.isString(duplicateButton) ? duplicateButton : 'Duplicate'}
        </Button>
      );
    }
    if (editButton) {
      buttons.push(
        <Button
          key="edit-btn"
          color="primary"
          type="button"
          loading={editButtonLoading}
          onClick={(e) => onPressButton(onEditButton, e)}
        >
          {_.isString(editButton) ? editButton : 'Edit'}
        </Button>
      );
    }
    if (saveButton) {
      buttons.push(
        <Button
          key="save-btn"
          color="primary"
          loading={saveButtonLoading}
          onClick={(e) => onPressButton(onSaveButton, e)}
        >
          {_.isString(saveButton) ? saveButton : 'Save'}
        </Button>
      );
    }
    if (importFamiliesButton) {
      buttons.push(
        <Button
          key="import-families-btn"
          color="primary"
          type="button"
          loading={importFamiliesButtonLoading}
          onClick={(e) => onPressButton(importFamiliesButton, e)}
        >
          <CloudUploadIcon className="w-6 h-6 mr-1" />
          {_.isString(importFamiliesButton) ? importFamiliesButton : 'Import families'}
        </Button>
      );
    }
    if (newButton) {
      buttons.push(
        <Button
          key="new-btn"
          color="secondary"
          type="button"
          loading={newButtonLoading}
          onClick={(e) => onPressButton(onNewButton, e)}
        >
          <PlusIcon className="w-6 h-6 mr-1" />
          {_.isString(newButton) ? newButton : 'New'}
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  return (
    <div
      className={`${className} bg-primary-content ${breadcrumbs ? 'py-6' : 'py-12'
        } ${separator ? ' border-b border-base-300' : 'border-0'}`}
    >
      <div className="max-w-screen-xl w-full mx-auto px-6">
        {getBreadcrumbs()}
        <div className="flex flex-row items-center justify-between">
          <div className="flex-grow max-w-screen-md">
            {getTitle()}
            {getDescription()}
          </div>
          <div className="flex flex-row space-x-2">{getButtons()}</div>
        </div>
      </div>
    </div>
  );
}
PageHeader.defaultProps = { separator: true };

PageHeader.propTypes = {
  className: PropTypes.string,
  breadcrumbs: PropTypes.array,
  title: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  description: PropTypes.string,
  registerFormTitle: PropTypes.any,
  registerFormTitleErrors: PropTypes.any,
  newButton: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  saveButton: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  cancelButton: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  duplicateButton: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  editButton: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  newButtonLoading: PropTypes.bool,
  saveButtonLoading: PropTypes.bool,
  cancelButtonLoading: PropTypes.bool,
  duplicateButtonLoading: PropTypes.bool,
  editButtonLoading: PropTypes.bool,
  onNewButton: PropTypes.func,
  onSaveButton: PropTypes.func,
  onCancelButton: PropTypes.func,
  onDuplicateButton: PropTypes.func,
  onEditButton: PropTypes.func,
  onButton: PropTypes.func,
};

export default PageHeader;
