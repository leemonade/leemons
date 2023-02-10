/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';

function Dashboard(data) {
  console.log(data);
  return 'Gatitos';
}

Dashboard.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default Dashboard;
