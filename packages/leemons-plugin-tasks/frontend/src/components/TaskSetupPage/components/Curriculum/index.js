import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Button, Stack, InputWrapper } from '@bubbles-ui/components';
import { CurriculumSelectContentsModal } from '@curriculum/components/CurriculumSelectContentsModal';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { listCurriculumsByProgramRequest } from '@curriculum/request';

function useCurriculum(program) {
  const [curriculum, setCurriculum] = useState(null);

  useEffect(async () => {
    if (!program) {
      return;
    }

    const { data: curriculumData } = await listCurriculumsByProgramRequest(program);

    if (curriculumData.count) {
      setCurriculum(curriculumData.items[0]);
    }
  }, program);

  return curriculum;
}

export default function Curriculum({ program, name, type, label, addLabel }) {
  const [show, setShow] = useState(false);
  const curriculum = useCurriculum(program);

  const { control } = useFormContext();

  if (!curriculum) {
    return null;
  }

  return (
    <InputWrapper label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = field.value?.map((v) => v[type]);
          return (
            <>
              <CurriculumSelectContentsModal
                {...field}
                opened={show}
                value={value}
                curriculum={curriculum?.id}
                onChange={(contents) => {
                  field.onChange(contents.map((content) => ({ [type]: content })));
                  setShow(false);
                }}
                onClose={() => setShow(false)}
              />
              <CurriculumListContents {...field} value={value} />

              <Stack>
                <Button leftIcon={<AddCircleIcon />} variant="light" onClick={() => setShow(true)}>
                  {addLabel}
                </Button>
              </Stack>
            </>
          );
        }}
      />
    </InputWrapper>
  );
}

Curriculum.propTypes = {
  program: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  addLabel: PropTypes.string.isRequired,
};
