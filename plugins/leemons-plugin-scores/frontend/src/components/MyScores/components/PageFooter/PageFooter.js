import PropTypes from 'prop-types';

import { PrintReportButton } from './PrintReportButton';

import useMyScoresStore from '@scores/stores/myScoresStore';

export default function Footer({ period }) {
  const finalScores = useMyScoresStore((store) => store.finalScores);

  if (!finalScores?.size) {
    return null;
  }

  return <PrintReportButton />;
}

Footer.propTypes = {
  period: PropTypes.string.isRequired,
};
