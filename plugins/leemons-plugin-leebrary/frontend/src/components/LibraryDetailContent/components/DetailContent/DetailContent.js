import { Box, Text, Stack, pxToRem, Badge, TextClamp, HtmlText } from '@bubbles-ui/components';
import React, { useMemo } from 'react';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import CopyrightText from '@leebrary/components/Copyright/CopyrightText';
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
  originalAsset,
}) => {
  const coverCopyrightProps = useMemo(() => {
    if (!originalAsset?.cover?.copyright) return null;
    const { copyright } = originalAsset.cover;
    const resourceType = copyright.provider === 'unsplash' ? 'photo' : 'image';
    const providerName = copyright.provider.charAt(0).toUpperCase() + copyright.provider.slice(1);
    return {
      resourceType,
      author: copyright.author,
      authorUrl: copyright.authorProfileUrl,
      sourceUrl: copyright.providerUrl,
      source: providerName,
    };
  }, [originalAsset]);

  // TODO PAOLA => Nombre del archivo cuando viene de unsplash AssetPage && NewResource

  return (
    <Box className={classes.tabPanel}>
      {coverCopyrightProps && <CopyrightText {...coverCopyrightProps} />}
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
