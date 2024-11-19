import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { Box, createStyles, Text, TextClamp, Badge } from '@bubbles-ui/components';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { AvatarActivity } from '../../../AvatarActivity';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export const useResourceRendererStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.lg,
      alignItems: 'center',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
    },
    activityName: {
      ...globalTheme.content.typo.body['md--bold'],
      color: globalTheme.content.color.text.default,
    },
  };
});

export function ResourceRenderer({ activity, id }) {
  const { useWatch } = useModuleAssignContext() ?? { useWatch: () => false };
  const isDeleted = useWatch({ name: `state.deleted.${id}` });

  const { classes } = useResourceRendererStyles();

  const roleLocalizations = useRolesLocalizations([activity?.role ?? activity?.providerData?.role]);

  const getAssetBadgeType = () => {
    if (activity?.role && activity?.role !== 'leebrary.asset') {
      return capitalize(
        roleLocalizations?.[activity?.role ?? activity?.providerData?.role]?.singular
      );
    }

    const typeMappings = {
      image: 'Image',
      bookmark: ['video'].includes(activity?.asset?.mediaType) ? 'Video' : 'Bookmark',
      'content-creator': 'Content creator',
      file: activity?.asset?.fileExtension === 'pdf' ? 'PDF' : 'File',
      video: 'Video',
      audio: 'Audio',
      document: activity?.asset?.fileExtension === 'pdf' ? 'PDF' : 'Document',
    };

    return typeMappings[activity?.asset?.fileType] || 'Media';
  };
  const badgeCategory = getAssetBadgeType();
  return (
    <Box className={classes.root}>
      <AvatarActivity activity={activity} />
      <Box className={classes.textContainer}>
        <TextClamp lines={1}>
          <Text className={classes.activityName} strikethrough={isDeleted}>
            {activity.asset.name}
          </Text>
        </TextClamp>
        <Badge size="xs" label={badgeCategory} closable={false} radius={'default'} />
      </Box>
    </Box>
  );
}

ResourceRenderer.propTypes = {
  id: PropTypes.string,
  activity: PropTypes.shape({
    providerData: PropTypes.shape({
      role: PropTypes.string,
    }),
    role: PropTypes.string,
    asset: PropTypes.shape({
      name: PropTypes.string,
      fileType: PropTypes.string,
      mediaType: PropTypes.string,
      fileExtension: PropTypes.string,
      cover: PropTypes.string,
    }),
    updatedAt: PropTypes.instanceOf(Date),
  }),
};
