import React from 'react';

import { Box, Select, Text, AvatarSubject, TextClamp } from '@bubbles-ui/components';
import propTypes from 'prop-types';

import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';

export function SubjectItem({ subject, isValueComponent, label, ...props }) {
  if (!subject) {
    return null;
  }
  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
          height: '100%',
          width: isValueComponent && '22ch',
        })}
      >
        <AvatarSubject
          color={subject?.color}
          icon={typeof subject?.icon === 'string' ? subject.icon : getClassIcon({ subject })}
          size={'md'}
          altText={subject?.label}
        />
        <Box>
          <TextClamp lines={1} withTooltip={subject.label}>
            <Text>{subject.label ?? label}</Text>
          </TextClamp>
          <TextClamp lines={1} withTooltip={subject.subLabel}>
            <Text size="xs" color="soft">
              {subject.subLabel}
            </Text>
          </TextClamp>
        </Box>
      </Box>
    </Box>
  );
}
export function SelectSubject({ data, value, onChange, ...props }) {
  React.useEffect(() => {
    if (typeof onChange === 'function') {
      if (value && !data.find((item) => item.value === value)) {
        onChange(null);
      } else if (!value && data?.length && data[0].value === 'all') {
        onChange('all');
      }
    }
  }, [data]);

  return (
    <Select
      {...props}
      data={data}
      value={[value]}
      onChange={(v) => onChange(v[0])}
      valueComponent={(item) => (
        <SubjectItem
          {...item}
          isValueComponent
          subject={data.find((d) => d.value === item.value)}
        />
      )}
      itemComponent={(item) => (
        <SubjectItem {...item} subject={data.find((d) => d.value === item.value)} />
      )}
    />
  );
}

SubjectItem.propTypes = {
  subject: propTypes.object,
  isValueComponent: propTypes.bool,
  label: propTypes.string,
};

SelectSubject.propTypes = {
  data: propTypes.arrayOf(propTypes.object),
  value: propTypes.string,
  onChange: propTypes.func,
};
