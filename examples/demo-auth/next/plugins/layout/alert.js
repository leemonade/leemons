import hooks from 'leemons-hooks';

export function addAlert(type, title, message, options) {
  hooks.fireEvent('layout:add:alert', {
    type,
    title,
    message,
    options,
  });
}

export function addErrorAlert(title, message, options) {
  return addAlert('error', title, message, options);
}

export function addSuccessAlert(title, message, options) {
  return addAlert('success', title, message, options);
}

export function addInfoAlert(title, message, options) {
  return addAlert('info', title, message, options);
}

export function addWarningAlert(title, message, options) {
  return addAlert('warning', title, message, options);
}

export function addDefaultAlert(title, message, options) {
  return addAlert('default', title, message, options);
}
