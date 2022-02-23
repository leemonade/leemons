import React from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, Title } from '@bubbles-ui/components';
import { SubjectsTable } from '../SubjectsTable';

const TreeNewSubjectDetail = ({ program, messages, onSave, saving, selectUserAgent }) => (
  <Box>
    <ContextContainer direction="column" fullWidth>
      <Title order={4}>{messages.title}</Title>
      <Box style={{ maxWidth: '100%', overflow: 'auto' }}>
        <SubjectsTable
          key="2"
          messages={messages.subjects}
          tableLabels={messages.tableLabels}
          program={program}
          onAdd={(d, e) => onSave(d, e, false)}
          teacherSelect={selectUserAgent}
          onlyNewSubject={true}
        />
      </Box>
    </ContextContainer>
  </Box>
);

TreeNewSubjectDetail.propTypes = {
  program: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeNewSubjectDetail };
