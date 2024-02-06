import { Box, Text, Stack, pxToRem, Badge } from '@bubbles-ui/components';
import React from 'react';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import { MetadataDisplay } from '../MetadataDisplay/MetadataDisplay';
import { DETAIL_CONTENT_PROP_TYPES, DETAIL_CONTENT_DEFAULT_PROPS } from './DetailContent.constants';

const DetailContent = ({
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
}) => (
  <Box className={classes.tabPanel}>
    {name && <Text className={classes.title}>{name}</Text>}
    {description && <Text className={classes.description}>{description}</Text>}
    <Box style={{ marginTop: 24, marginBottom: 24 }}>
      {Array.isArray(subjectsIds) &&
        subjectsIds.length > 0 &&
        subjectsIds?.map((subject) => (
          <Box key={subject?.subject} className={classes.subjectItem}>
            <SubjectItemDisplay subjectsIds={[subject?.subject]} programId={program} />
          </Box>
        ))}
    </Box>
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
          {tags.map((tag, index) => (
            <Box key={`${tag} ${index}`}>
              <Badge label={tag} size="md" closable={false} className={classes.labelBadge} />
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

DetailContent.propTypes = DETAIL_CONTENT_PROP_TYPES;
DetailContent.defaultProps = DETAIL_CONTENT_DEFAULT_PROPS;
DetailContent.displayName = 'DetailContent';

export { DetailContent };
