import React, { useState, useCallback } from 'react';

import { SubjectItemDisplay } from '@academic-portfolio/components';
import { Box, Text, Stack, pxToRem, Badge, TextClamp } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets/ZoneWidgets';

import { MetadataDisplay } from '../MetadataDisplay/MetadataDisplay';

import { DETAIL_CONTENT_PROP_TYPES, DETAIL_CONTENT_DEFAULT_PROPS } from './DetailContent.constants';

const DetailContent = ({
  asset,
  name,
  description,
  subjectsIds,
  program,
  metadataComponent,
  handleCopy,
  tags,
  metadata,
  icon,
  fileType,
  fileExtension,
  variant,
  variantIcon,
  variantTitle,
  file,
  url,
  classes,
}) => {
  const [showWidgets, setShowWidgets] = useState(false);
  const [widgetsLoading, setWidgetsLoading] = useState(true);

  const Widgets = useCallback(
    ({ Component, key, properties }) =>
      showWidgets ? <Component key={key} {...properties} asset={asset} /> : null,
    [asset, showWidgets]
  );

  return (
    <Box className={classes.tabPanel}>
      {!!name && (
        <TextClamp lines={1}>
          <Text className={classes.title}>{name}</Text>
        </TextClamp>
      )}
      {!!description && (
        <TextClamp lines={2}>
          <Text className={classes.description}>{description}</Text>
        </TextClamp>
      )}

      <Box sx={{
          marginBlock: 24,
          '&:empty': { marginBlock: 0 },
          display: widgetsLoading || !showWidgets ? 'none' : 'block'
        }}>
        <ZoneWidgets
          zone="leebrary.asset.drawer"
          container={<React.Fragment />}
          onGetZone={(value) => {
            setShowWidgets(value.widgetItems?.length > 0);
            setWidgetsLoading(false);
          }}
        >
          {Widgets}
        </ZoneWidgets>
      </Box>

      {Array.isArray(subjectsIds) && subjectsIds.length > 0 && (
        <Box sx={{ marginBlock: 24 }}>
          {subjectsIds?.map((subject) => (
            <Box key={subject?.subject} className={classes.subjectItem}>
              <SubjectItemDisplay subjectsIds={[subject?.subject]} programId={program} />
            </Box>
          ))}
        </Box>
      )}
      <Stack
        direction="column"
        className={classes.lowerContent}
        styles={{ marginTop: !name || !description ? pxToRem(24) : 0 }}
      >
        {metadataComponent || (
          <MetadataDisplay
            metadata={{
              metadata,
              icon,
              fileType,
              fileExtension,
              variant,
              variantIcon,
              variantTitle,
              file,
              url,
              name,
            }}
            onCopy={handleCopy}
          />
        )}
      </Stack>
      {tags?.length > 0 && (
        <Box className={classes.tags}>
          <Box className={classes.tagsContainer}>
            {tags.map((tag) => (
              <Box key={tag}>
                <Badge
                  label={tag}
                  size="xs"
                  color={'stroke'}
                  radius={'rounded'}
                  closable={false}
                  skipFlex
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

DetailContent.propTypes = DETAIL_CONTENT_PROP_TYPES;
DetailContent.defaultProps = DETAIL_CONTENT_DEFAULT_PROPS;
DetailContent.displayName = 'DetailContent';

export { DetailContent };
