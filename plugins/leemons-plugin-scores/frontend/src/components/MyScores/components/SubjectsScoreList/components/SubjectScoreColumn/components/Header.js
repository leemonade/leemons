import React from 'react';
import PropTypes from 'prop-types';

import { Box, ImageLoader, Stack, Text, TextClamp, Tooltip } from '@bubbles-ui/components';

import prepareAsset from '@leebrary/helpers/prepareAsset';
import WeightTypeBadge from '@scores/components/EvaluationNotebook/ScoresTable/components/WeightTypeBadge';

export default function Header({ class: klass, weights }) {
  const { subject, groups } = klass;

  const subjectImage = prepareAsset(subject.image).cover;
  const className = groups ? `${subject.name} (${groups.name})` : subject.name;

  return (
    <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" fullWidth>
      {subjectImage ? (
        <ImageLoader src={subjectImage} height={56} width={56} radius="50%" />
      ) : (
        <Box sx={{ width: 56, height: 56 }} />
      )}
      <TextClamp lines={2}>
        <Text align="center" strong>
          {className}
        </Text>
      </TextClamp>
      {weights?.explanation ? (
        <Tooltip label={weights.explanation}>
          <WeightTypeBadge class={klass} />
        </Tooltip>
      ) : (
        <WeightTypeBadge class={klass} />
      )}
    </Stack>
  );
}

Header.propTypes = {
  class: PropTypes.shape({
    subject: PropTypes.shape({
      image: PropTypes.object.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    groups: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  weights: PropTypes.object,
};
