import React from 'react';
import { Badge, Box, ContextContainer, Drawer, Text, UserCards } from '@bubbles-ui/components';
import { UserDetailModalStyles } from './UserDetailModal.styles';
import {
  USER_DETAIL_MODAL_DEFAULT_PROPS,
  USER_DETAIL_MODAL_PROP_TYPES,
} from './UserDetailModal.constants';
import { isFunction } from 'lodash';

const UserDetailModal = ({ user, labels, badges, opened, onClose, ...props }) => {
  const handleOnClose = () => {
    isFunction(onClose) && onClose();
  };

  const renderBadges = () => {
    if (badges) {
      return badges.map((badge) => (
        <Box key={badge}>
          <Badge label={badge} color="stroke" radius="default" closable={false} />
        </Box>
      ));
    }
    return null;
  };

  const renderLabels = () => {
    if (user) {
      const userKeys = Object.keys(user);
      const filteredLabels = Object.keys(labels).filter((label) => userKeys.includes(label));
      return filteredLabels.map((label) => (
        <Box key={label}>
          <Text color="primary" role="productive">
            {labels[label]}
          </Text>
        </Box>
      ));
    }
    return null;
  };

  const renderPersonalInfo = () => {
    if (user) {
      const userKeys = Object.keys(user);
      const labelKeys = Object.keys(labels);
      const filteredLabels = labelKeys.filter((label) => userKeys.includes(label));

      return filteredLabels.map((label) => {
        const value = user[label] instanceof Date ? user[label].toLocaleDateString() : user[label];

        return (
          <Box key={`${label}-info`}>
            <Text role="productive">{value}</Text>
          </Box>
        );
      });
    }
    return null;
  };

  const { classes, cx } = UserDetailModalStyles({}, { name: 'UserDetailModal' });
  return (
    <Drawer opened={opened} onClose={handleOnClose} centered position="right" size={650} {...props}>
      <ContextContainer divided>
        {user ? <UserCards layout="horizontal" variant="large" user={{ ...user }} /> : null}
        <ContextContainer title={labels.personalInformation}>
          <Box className={classes.personalInformation}>
            <Box className={classes.labelCol}>{renderLabels()}</Box>
            <Box className={classes.infoCol}>{renderPersonalInfo()}</Box>
          </Box>
        </ContextContainer>
        {badges && badges.length ? (
          <ContextContainer title={labels.badges} spacing={4}>
            {renderBadges()}
          </ContextContainer>
        ) : null}
      </ContextContainer>
    </Drawer>
  );
};

UserDetailModal.defaultProps = USER_DETAIL_MODAL_DEFAULT_PROPS;
UserDetailModal.propTypes = USER_DETAIL_MODAL_PROP_TYPES;

export { UserDetailModal };
