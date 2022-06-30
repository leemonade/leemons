import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BranchBlockCodeManual from './BranchBlockCodeManual';
import BranchBlockCodeAutocomposed from './BranchBlockCodeAutocomposed';

function BranchBlockCode({ ...props }) {
  const {
    form: { watch, unregister },
  } = props;

  const formData = watch();

  useEffect(() => {
    const subscription = watch(({ limitCharacters, codeType }, { name }) => {
      if (name === 'codeType') {
        if (codeType === 'manual') {
          unregister('codeText');
        } else if (codeType === 'autocomposed') {
          unregister('limitCharacters');
          unregister('min');
          unregister('max');
        }
      }
      if (name === 'limitCharacters') {
        if (!limitCharacters) {
          unregister('min');
          unregister('max');
        }
      }
    });
    return () => subscription.unsubscribe();
  });

  if (formData.codeType === 'manual') return <BranchBlockCodeManual {...props} />;
  if (formData.codeType === 'autocomposed') return <BranchBlockCodeAutocomposed {...props} />;
  return null;
}

BranchBlockCode.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  selectData: PropTypes.object,
  form: PropTypes.object,
};

export default BranchBlockCode;
