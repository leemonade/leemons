import { useHistory } from 'react-router-dom';

import { Box, Text, Title, ImageLoader } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { WelcomeCardStyles } from './WelcomeCard.styles';

const WelcomeCard = ({ cover, title, description, linkTo, imageStyles }) => {
  const { classes } = WelcomeCardStyles({ linkTo }, { name: 'WelcomeCard' });
  const history = useHistory();
  const handleLinkTo = () => {
    if (!linkTo) return;
    if (linkTo.includes('http')) {
      window.open(linkTo, '_blank');
    } else {
      history.push(linkTo);
    }
  };
  return (
    <Box className={classes.root} onClick={handleLinkTo}>
      <Box className={classes.cover} style={imageStyles}>
        <ImageLoader src={cover} height={221} width={376} />
      </Box>
      <Box className={classes.content}>
        <Title order={4}>{title}</Title>
        <Text>{description}</Text>
      </Box>
    </Box>
  );
};

WelcomeCard.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  linkTo: PropTypes.string,
  imageStyles: PropTypes.object,
};

export { WelcomeCard };
