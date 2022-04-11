import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Paragraph, RadioGroup, Title } from '@bubbles-ui/components';

const ProgramTreeType = forwardRef(({ messages, data, value, onChange }, ref) => (
  <Box>
    <Title order={4}>{messages.title}</Title>
    <Paragraph>{messages.description1}</Paragraph>
    <Paragraph>
      <strong>{messages.note}</strong>
      {messages.description2}
    </Paragraph>
    <RadioGroup ref={ref} direction="column" value={value} data={data} onChange={onChange} />
  </Box>
));

ProgramTreeType.displayName = '@academic-portfolio/components/ProgramTreeType';
ProgramTreeType.propTypes = {
  messages: PropTypes.object,
  value: PropTypes.number,
  onChange: PropTypes.func,
  data: PropTypes.array,
};

export { ProgramTreeType };
export default ProgramTreeType;
