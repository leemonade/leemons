import React from 'react';
import { Stack, Text, ImageLoader } from '@bubbles-ui/components';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { RenderTextWithCTAs } from '@common';
import HelpCenterIcon from '@assignables/assets/emptyStates/helpCenter.svg';
import LeebraryIcon from '@assignables/assets/emptyStates/leebrary.svg';
import ComunicaIcon from '@assignables/assets/emptyStates/comunica.svg';
import { useEmptyStateStyles } from './EmptyState.styles';

export function EmptyState() {
  const isTeacher = useIsTeacher();
  const [t] = useTranslateLoader(
    prefixPN(`need_your_attention.welcome.${isTeacher ? 'teacher' : 'student'}`)
  );
  const [linksT] = useTranslateLoader(prefixPN('need_your_attention.links'));

  const { classes, cx } = useEmptyStateStyles();

  if (isTeacher) {
    return (
      <Stack direction="row" justifyContent="center" fullWidth>
        <Stack direction="column" alignItems="center" spacing={6} className={classes.root}>
          <Stack direction="column" alignItems="center" spacing={4}>
            <Text color="primary" className={cx(classes.text, classes.title)}>
              {t('title')}
            </Text>
            <Text color="primary" className={classes.text}>
              {t('description1')}
            </Text>
            <Text color="primary" className={classes.text}>
              {t('description2')}
            </Text>
          </Stack>
          <Stack
            direction="row"
            alignItems="end"
            justifyContent="space-between"
            className={classes.cardContainer}
          >
            <Stack direction="column" alignItems="center" spacing={5}>
              <ImageLoader
                src={HelpCenterIcon}
                style={{ position: 'relative' }}
                width={240}
                height={240}
              />
              <Text color="primary" className={cx(classes.text, classes.title2)}>
                {t('helpCenter.title')}
              </Text>
              <RenderTextWithCTAs
                t={t}
                text={'helpCenter.description'}
                replacers={{
                  CTA: {
                    type: 'linkT',
                    value: 'helpCenter.cta',
                    url: linksT('academy'),
                  },
                }}
              />
            </Stack>
            <Stack direction="column" alignItems="center" spacing={5}>
              <ImageLoader
                src={LeebraryIcon}
                style={{ position: 'relative' }}
                width={240}
                height={240}
              />
              <Text color="primary" className={cx(classes.text, classes.title2)}>
                {t('leebrary.title')}
              </Text>
              <RenderTextWithCTAs
                t={t}
                text={'leebrary.description'}
                replacers={{
                  CTA: {
                    type: 'linkT',
                    value: 'leebrary.cta',
                    url: linksT('library'),
                  },
                }}
              />
            </Stack>
            <Stack direction="column" alignItems="center" spacing={5}>
              <ImageLoader
                src={ComunicaIcon}
                style={{ position: 'relative' }}
                width={240}
                height={240}
              />
              <Text color="primary" className={cx(classes.text, classes.title2)}>
                {t('comunica.title')}
              </Text>
              <Text color="primary" className={classes.text}>
                {t('comunica.description')}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justifyContent="center" fullWidth>
      <Stack direction="column" alignItems="center" spacing={6} className={classes.root}>
        <Stack direction="column" alignItems="center" spacing={4}>
          <Text color="primary" className={cx(classes.text, classes.title)}>
            {t('title')}
          </Text>
          <Text color="primary" className={classes.text}>
            {t('description1')}
          </Text>
          <Text color="primary" className={classes.text}>
            {t('description2')}
          </Text>
        </Stack>
        <Stack
          direction="row"
          alignItems="end"
          justifyContent="space-between"
          className={classes.cardContainer}
        >
          <Stack direction="column" alignItems="center" spacing={5}>
            <ImageLoader
              src={HelpCenterIcon}
              style={{ position: 'relative' }}
              width={240}
              height={240}
            />
            <Text color="primary" className={cx(classes.text, classes.title2)}>
              {t('helpCenter.title')}
            </Text>
            <RenderTextWithCTAs
              t={t}
              text={'helpCenter.description'}
              replacers={{
                CTA: {
                  type: 'linkT',
                  value: 'helpCenter.cta',
                  url: linksT('academy'),
                },
              }}
            />
          </Stack>
          <Stack direction="column" alignItems="center" spacing={5}>
            <ImageLoader
              src={ComunicaIcon}
              style={{ position: 'relative' }}
              width={240}
              height={240}
            />
            <Text color="primary" className={cx(classes.text, classes.title2)}>
              {t('comunica.title')}
            </Text>
            <Text color="primary" className={classes.text}>
              {t('comunica.description')}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default EmptyState;
