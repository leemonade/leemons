import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  HtmlText,
  InputWrapper,
  Radio,
  Stack,
  ListItem,
  ImageLoader,
  useTheme,
} from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/solid';
import ImagePicker from '@leebrary/components/ImagePicker';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// eslint-disable-next-line import/prefer-default-export
export function ListItemRender({
  item,
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
      <Box noFlex sx={() => ({ width: 50, minHeight: 48, textAlign: 'center' })}>
        {!item.hideOnHelp ? (
          <Radio checked={item.isCorrectResponse} onChange={() => changeCorrectResponse(item)} />
        ) : null}

        {showEye && item.hideOnHelp ? (
          <ViewOffIcon
            width={18}
            height={40}
            color={theme?.other.global.content.color.icon.default}
          />
        ) : null}
      </Box>
      <Box>
        {withImages && item.image ? (
          <Stack fullWidth spacing={4} alignItems="center">
            <Box>
              <ImageLoader
                src={getFileUrl(item.image)}
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
              {useExplanation && item.explanation ? (
                <Box>
                  <Text>{item.explanation}</Text>
                </Box>
              ) : null}
            </Box>
          </Stack>
        ) : null}

        {!withImages ? (
          <Box>
            {item.response ? (
              <Box>
                <Text color="primary">{item.response}</Text>
              </Box>
            ) : null}
            {useExplanation && item.explanation ? (
              <Box>
                <Text>{item.explanation}</Text>
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
