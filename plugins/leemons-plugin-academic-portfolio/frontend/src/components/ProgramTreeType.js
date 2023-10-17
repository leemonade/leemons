import { getProgramTreeTypeTranslation } from '@academic-portfolio/helpers/getProgramTreeTypeTranslation';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { Box, Paragraph, RadioGroup, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ProgramTreeType = forwardRef(({ program, onChange }, ref) => {
  const [t] = useTranslateLoader(prefixPN('subject_page'));
  const messages = React.useMemo(
    () => ({
      programTreeType: getProgramTreeTypeTranslation(t),
    }),
    [t]
  );

  if (!program) return null;

  let help1 = null;
  let help2 = null;
  let help3 = null;

  if (program?.moreThanOneAcademicYear) {
    if (program?.cycles?.length) {
      help1 = messages.programTreeType.opt1DescriptionNoCourseCycle;
      help2 = messages.programTreeType.opt2DescriptionNoCourseCycle;
      help3 = messages.programTreeType.opt3DescriptionNoCourseCycle;
    } else {
      help1 = messages.programTreeType.opt1DescriptionNoCourse;
      help2 = messages.programTreeType.opt2DescriptionNoCourse;
      help3 = messages.programTreeType.opt3DescriptionNoCourse;
    }
  } else if (program?.cycles?.length) {
    help1 = messages.programTreeType.opt1DescriptionCycle;
    help2 = messages.programTreeType.opt2DescriptionCycle;
    help3 = messages.programTreeType.opt3DescriptionCycle;
  } else {
    help1 = messages.programTreeType.opt1Description;
    help2 = messages.programTreeType.opt2Description;
    help3 = messages.programTreeType.opt3Description;
  }
  const data = [
    {
      value: 1,
      label: messages.programTreeType.opt1Label,
      help: help1,
      helpPosition: 'bottom',
    },
    {
      value: 2,
      label: messages.programTreeType.opt2Label,
      help: help2,
      helpPosition: 'bottom',
    },
    {
      value: 3,
      label: messages.programTreeType.opt3Label,
      help: help3,
      helpPosition: 'bottom',
    },
    {
      value: 4,
      label: messages.programTreeType.opt4Label,
      help: messages.programTreeType.opt4Description,
      helpPosition: 'bottom',
    },
  ];

  return (
    <Box>
      <Title order={4}>{messages.programTreeType.title.replace('{name}', program.name)}</Title>
      <Paragraph>{messages.programTreeType.description1}</Paragraph>
      <Paragraph>
        <strong>{messages.programTreeType.note}</strong>
        {messages.programTreeType.description2}
      </Paragraph>
      <RadioGroup
        ref={ref}
        direction="column"
        value={program.treeType}
        data={data}
        onChange={onChange}
      />
    </Box>
  );
});

ProgramTreeType.displayName = '@academic-portfolio/components/ProgramTreeType';
ProgramTreeType.propTypes = {
  program: PropTypes.object,
  onChange: PropTypes.func,
};

export { ProgramTreeType };
export default ProgramTreeType;
