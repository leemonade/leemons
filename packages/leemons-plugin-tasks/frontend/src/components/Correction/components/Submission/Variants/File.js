import React from 'react';
import { Text, ContextContainer, Box } from '@bubbles-ui/components';

export default function File({ assignation }) {
  const submittedFiles = assignation.metadata?.submission;

  if (Array.isArray(submittedFiles)) {
    return (
      <Box>
        <ContextContainer spacing={2}>
          {submittedFiles.map((file) => (
            <Text key={file.id}>{file.id}</Text>
          ))}
        </ContextContainer>
      </Box>
    );
  }

  return <Text>Files not submitted</Text>;
}
