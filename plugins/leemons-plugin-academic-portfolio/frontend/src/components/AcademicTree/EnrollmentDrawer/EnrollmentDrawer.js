import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@bubbles-ui/components';

const EnrollmentDrawer = ({ isOpen, setIsOpen, classes }) => {
  console.log('classes', classes);
  console.log('isOpen', isOpen);
  return (
    <Drawer opened={isOpen} close={true} size={728} empty onClose={() => setIsOpen(false)}>
      <div>Soy el drawer</div>
    </Drawer>
  );
};

EnrollmentDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  classes: PropTypes.array,
};
export default EnrollmentDrawer;
