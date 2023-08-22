import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BranchBlockListCustomOrder from './BranchBlockListCustomOrder';

function BranchBlockList({ ...props }) {
  const {
    form: { watch, unregister },
  } = props;

  const formData = watch();

  useEffect(() => {
    const subscription = watch(({ listOrdered }, { name }) => {
      if (name === 'listOrdered' && listOrdered !== 'custom') {
        unregister('inheritFromParent');
      }
    });
    return () => subscription.unsubscribe();
  });

  if (formData.listOrdered === 'custom') return <BranchBlockListCustomOrder {...props} />;
  return null;
}

BranchBlockList.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  selectData: PropTypes.object,
  form: PropTypes.object,
};

export default BranchBlockList;
