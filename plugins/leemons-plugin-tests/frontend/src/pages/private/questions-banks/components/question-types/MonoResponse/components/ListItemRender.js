import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Radio, Stack, ImageLoader, useTheme } from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/solid';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { omit } from 'lodash';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// eslint-disable-next-line import/prefer-default-export
export function ListItemRender({
  item = {},
  index,
  t,
  useExplanation,
  withImages,
  changeCorrectResponse,
  toggleHideOnHelp,
  showEye,
  canSetHelp,
}) {
  const theme = useTheme();

  return (
    <Stack fullWidth alignItems="center">
      <Box noFlex>
        <Text color="primary" strong>
          {LETTERS[index]}
        </Text>
      </Box>
      <Box noFlex sx={() => ({ width: 50, minHeight: 48, textAlign: 'center', marginTop: -4 })}>
        {!item.hideOnHelp ? (
          <Radio checked={item.isCorrect} onChange={() => changeCorrectResponse(item)} />
        ) : null}

        {showEye && item.hideOnHelp ? (
          <Box sx={() => ({ marginTop: 4 })}>
            <ViewOffIcon
              width={18}
              height={40}
              color={theme?.other.global.content.color.icon.default}
            />
          </Box>
        ) : null}
      </Box>
      <Box>
        {withImages && item.image ? (
          <Stack fullWidth spacing={4} alignItems="center">
            <Box>
              <ImageLoader
                src={getFileUrl(item.image.cover?.id || item.image)}
                width={72}
                height={52}
                bordered
                radius={4}
              />
            </Box>
            <Box>
              {item.imageDescription ? (
                <Box>
                  <Text color="primary">{item.imageDescription}</Text>
                </Box>
              ) : null}
              {useExplanation && item.feedback ? (
                <Box>
                  <Text>{item.feedback.text}</Text>
                </Box>
              ) : null}
            </Box>
          </Stack>
        ) : null}

        {!withImages && item.text?.text ? (
          <Box>
            {item.text.text ? (
              <Box sx={() => ({ marginTop: -2 })}>
                <Text color="primary">{item.text.text}</Text>
              </Box>
            ) : null}
            {useExplanation && item.feedback ? (
              <Box>
                <Text>{item.feedback.text}</Text>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
}

ListItemRender.propTypes = {
  canSetHelp: PropTypes.bool,
  item: PropTypes.object,
  t: PropTypes.func,
  useExplanation: PropTypes.bool,
  withImages: PropTypes.bool,
  toggleHideOnHelp: PropTypes.func,
  changeCorrectResponse: PropTypes.func,
  showEye: PropTypes.bool,
  index: PropTypes.number,
};
