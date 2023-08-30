import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { Box, Select, Text, BulletSubject } from '@bubbles-ui/components';
import React from 'react';

export function SubjectItem({ subject, isValueComponent, ...props }) {
  if (!subject) {
    return null;
  }

  const iconSubject = typeof subject?.icon === 'string' ? subject.icon : getClassIcon({ subject });

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
        <BulletSubject
          color={subject?.color}
          icon={iconSubject}
          altText={subject?.name}
          size={'sm'}
        />
        <Text truncated>{subject.label}</Text>
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
