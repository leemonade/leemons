import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TranslatorModal } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '../helpers/useCommonTranslate';

export default function PlatformLocalesModal({ children, title, ...props }) {
  const [loading, setLoading] = useState(false);
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonTrans } = useCommonTranslate('translation');

  // ······························································································
  // TRANSLATOR MODAL PROPS

  const labels = useMemo(
    () => ({
      trigger: tCommonTrans('label'),
      help: tCommonTrans('help'),
      title: title || tCommonTrans('title'),
      save: tCommonHeader('save'),
      cancel: tCommonHeader('cancel'),
      close: tCommonHeader('close'),
    }),
    [tCommonHeader, tCommonTrans]
  );

  if (!loading && !error) {
    return (
      <TranslatorModal {...props} labels={labels}>
        {children}
      </TranslatorModal>
    );
  }

  return <ErrorAlert />;
}

PlatformLocalesModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
