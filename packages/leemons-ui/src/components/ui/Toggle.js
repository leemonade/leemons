import React, { forwardRef } from 'react';
import Checkbox from './Checkbox';

const Toggle = forwardRef((props, ref) => <Checkbox {...props} ref={ref} asToggle />);

export default Toggle;
