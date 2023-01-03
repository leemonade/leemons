import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, InputWrapper, Stack } from '@bubbles-ui/components';
import { CurriculumSelectContentsModal } from '@curriculum/components/CurriculumSelectContentsModal';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { listCurriculumsByProgramRequest } from '@curriculum/request';

function useCurriculum(program) {
  const [curriculum, setCurriculum] = useState(null);

  useEffect(() => {
    (async () => {
      if (!program) {
        return;
      }

      const { data: curriculumData } = await listCurriculumsByProgramRequest(program);

      if (curriculumData.count) {
        setCurriculum(curriculumData.items[0]);
      }
    })();
  }, [program]);

  return curriculum;
}

export default function Curriculum({
  control: _c,
  program,
  name,
  type,
  label,
  subjects,
  addLabel,
}) {
  const [show, setShow] = useState(false);
  const curriculum = useCurriculum(program);

  const { control } = _c ? { control: _c } : useFormContext();

  if (!curriculum) {
    return null;
  }

  return (
    <InputWrapper label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = type ? field.value?.map((v) => v[type]) : field.value;
          return (
            <>
              <CurriculumSelectContentsModal
                {...field}
                opened={show}
                value={value}
                subjects={subjects}
                curriculum={curriculum?.id}
                onChange={(contents) => {
                  field.onChange(
                    type ? contents.map((content) => ({ [type]: content })) : contents
                  );
                  setShow(false);
                }}
                onClose={() => setShow(false)}
              />
              <CurriculumListContents {...field} value={value} subjects={subjects} />

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
  control: PropTypes.any,
  program: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  subjects: PropTypes.any,
  addLabel: PropTypes.string.isRequired,
};
