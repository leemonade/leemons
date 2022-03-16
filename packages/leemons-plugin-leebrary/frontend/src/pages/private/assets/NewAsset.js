import React, { useEffect, useMemo, useState, useContext } from 'react';
import { isEmpty } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Stack, ContextContainer, ActionButton, Grid, Col } from '@bubbles-ui/components';
import { ChevronLeftIcon } from '@bubbles-ui/icons/outline';
import { LibraryForm } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten, TagsAutocomplete } from '@common';
import { LayoutContext } from '@layout/context/layout';
import prefixPN from '../../../helpers/prefixPN';
import { newAssetRequest } from '../../../request';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';

const NewAssetPage = () => {
  const { file, setView, category, selectCategory } = useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('form'));
  const history = useHistory();
  const params = useParams();
  const [tags, setTags] = useState([]);
  const { setLoading } = useContext(LayoutContext);

  useEffect(() => {
    setView(VIEWS.NEW);
    selectCategory(params.category);
  }, [params]);

  const handleOnBack = () => {
    history.goBack();
  };

  const handleOnTagsChange = (val) => {
    console.log(val);
    setTags(val);
  };

  const handleOnSubmit = async (data) => {
    console.log(data);
    setLoading(true);

    try {
      await newAssetRequest(data, category.id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.form;
      data.labels.title = data.header.titleNew;
      return data;
    }
    return {};
  }, [translations]);

  return (
    <Grid columns={10}>
      <Col span={5}>
        <Box>
          <Box sx={(theme) => ({ padding: `${theme.spacing[3]}px ${theme.spacing[9]}px` })}>
            <Stack fullWidth justifyContent="start">
              <ActionButton
                icon={<ChevronLeftIcon />}
                label={formLabels?.header?.back || 'Back'}
                tooltip={formLabels?.header?.back || 'Back'}
                onClick={handleOnBack}
              />
            </Stack>
          </Box>
          <Box padding={9}>
            <LibraryForm {...formLabels} asset={{ file }} onSubmit={handleOnSubmit}>
              <ContextContainer subtitle="Tags" spacing={1}>
                <TagsAutocomplete
                  pluginName="leebrary"
                  labels={{ addButton: formLabels?.labels?.addTag }}
                  placeholder={formLabels?.placeholders?.tagsInput}
                  value={tags}
                  onChange={handleOnTagsChange}
                />
              </ContextContainer>
            </LibraryForm>
          </Box>
        </Box>
      </Col>
    </Grid>
  );
};

export { NewAssetPage };
export default NewAssetPage;
