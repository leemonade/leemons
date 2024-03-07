import React from 'react';
import PropTypes from 'prop-types';
import { Box, HtmlText, InputWrapper, Radio, Stack } from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/outline';
import ImagePicker from '@leebrary/components/ImagePicker';

// eslint-disable-next-line import/prefer-default-export
export function ListItemValueRender({
  item,
  t,
  useExplanation,
  withImages,
  changeCorrectResponse,
  toggleHideOnHelp,
  showEye,
  canSetHelp,
}) {
  return (
    <Box sx={() => ({ width: '100%' })}>
      <Stack fullWidth alignItems="start" justifyContent="start">
        <Radio checked={item.isCorrectResponse} onChange={() => changeCorrectResponse(item)} />
        {!item.isCorrectResponse && showEye && (canSetHelp || (!canSetHelp && item.hideOnHelp)) ? (
          <Box
            sx={(theme) => ({
              marginLeft: -theme.spacing[5],
              marginRight: theme.spacing[5],
              marginTop: theme.spacing[1],
              fontSize: theme.fontSizes[4],
              cursor: 'pointer',
              color: item.hideOnHelp ? theme.colors.interactive01 : theme.colors.text06,
            })}
            onClick={() => toggleHideOnHelp(item)}
          >
            <ViewOffIcon />
          </Box>
        ) : (
          <Box style={{ width: 18 }}></Box>
        )}

        <Box>
          {withImages ? (
            <>
              {item.image ? (
                <>
                  <Stack fullWidth spacing={4}>
                    <Box>
                      <ImagePicker value={item.image} readonly={true} />
                    </Box>
                    <Box>
                      <InputWrapper label={t('caption')}>{item.imageDescription}</InputWrapper>
                    </Box>
                  </Stack>
                  {useExplanation ? (
                    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                      <InputWrapper label={t('explanationLabel')}>
                        <HtmlText>{item.explanation}</HtmlText>
                      </InputWrapper>
                    </Box>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              {item.response}
              <Box
                sx={(theme) => ({ borderTop: '1px dashed #333333', marginTop: theme.spacing[4] })}
              />
              {useExplanation ? (
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <InputWrapper label={t('explanationLabel')}>
                    <HtmlText>{item.explanation}</HtmlText>
                  </InputWrapper>
                </Box>
              ) : null}
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

ListItemValueRender.propTypes = {
  canSetHelp: PropTypes.bool,
  item: PropTypes.object,
  t: PropTypes.func,
  useExplanation: PropTypes.bool,
  withImages: PropTypes.bool,
  toggleHideOnHelp: PropTypes.func,
  changeCorrectResponse: PropTypes.func,
  showEye: PropTypes.bool,
};
