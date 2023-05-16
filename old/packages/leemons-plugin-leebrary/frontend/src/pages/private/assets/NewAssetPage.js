/* eslint-disable no-unreachable */
import React, { useContext, useEffect, useMemo } from 'react';
import { isArray, isEmpty } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { ActionButton, Box, createStyles, Stack } from '@bubbles-ui/components';
import { ChevronLeftIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../../helpers/prefixPN';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';
import {
  BasicData as MediaBasicData,
  BookmarkBasicData,
  PermissionsData,
  Setup,
} from '../../../components/AssetSetup';

const NewAssetPageStyles = createStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.xs,
    flex: 1,
  },
}));

const NewAssetPage = () => {
  const { file, setView, category, selectCategory, setAsset, asset } = useContext(LibraryContext);
  const [t] = useTranslateLoader(prefixPN('assetSetup'));
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    setView(VIEWS.NEW);
    selectCategory(params.category);
  }, [params]);

  const handleOnBack = () => {
    history.goBack();
  };

  const handleOnFinish = () => {
    handleOnBack();
  };

  // ·········································································
  // INIT VALUES

  const setupProps = useMemo(() => {
    if (!isEmpty(category)) {
      const labels = {
        basicData: t('basicData.header.stepLabel'),
        permissionsData: t('permissionsData.header.stepLabel'),
      };

      return {
        steps: [
          {
            label: labels.basicData,
            content:
              category.key === 'bookmarks' ? (
                <BookmarkBasicData
                  advancedConfig={{
                    alwaysOpen: false,
                    program: { show: true, required: false },
                    subjects: { show: true, required: false, showLevel: true, maxOne: false },
                  }}
                  categoryId={category?.id}
                  onSave={setAsset}
                />
              ) : (
                <MediaBasicData
                  advancedConfig={{
                    alwaysOpen: false,
                    program: { show: true, required: false },
                    subjects: { show: true, required: false, showLevel: true, maxOne: false },
                  }}
                  file={file}
                  categoryId={category?.id}
                  onSave={setAsset}
                />
              ),
          },
          {
            label: labels.permissionsData,
            content: <PermissionsData asset={asset} />,
          },
        ],
      };
    }
    return null;
  }, [t, file, category, asset]);

  const { classes, cx } = NewAssetPageStyles({}, { name: 'NewAssetPage' });

  return (
    <Stack fullWidth fullHeight>
      <Box className={classes.root} skipFlex>
        <Box sx={(theme) => ({ padding: `${theme.spacing[4]}px ${theme.spacing[7]}px` })}>
          <Stack fullWidth justifyContent="start">
            <ActionButton
              icon={<ChevronLeftIcon />}
              label={t('header.back')}
              tooltip={t('header.back')}
              onClick={handleOnBack}
            />
          </Stack>
        </Box>
        <Box sx={(theme) => ({ padding: `${theme.spacing[4]}px ${theme.spacing[8]}px` })}>
          {!isEmpty(setupProps) && isArray(setupProps.steps) && (
            <Setup {...setupProps} onFinish={handleOnFinish} />
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export { NewAssetPage };
export default NewAssetPage;
