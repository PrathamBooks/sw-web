import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import './NotificationModal.scss';
import { connect } from 'react-redux';
import { removeNotificationModal } from '../../redux/notificationModalActions';


const mapStateToProps = ({ notificationModal }) => {
  return {
    isVisible: notificationModal.isNotificationModalVisible,
    notification: notificationModal.notification
  }
}

const mapDispatchToProps = {
  removeNotificationModal
};

@connect(mapStateToProps, mapDispatchToProps)

class NotificationModal extends Component {

  onCloseModal = () => {
    this.props.removeNotificationModal();
  }

  render () {
    const { isVisible, notification} = this.props;

    const baseClassName = 'pb-quick-view-modal';
 
    if (!isVisible) {
      return null;
    }

    const header = (
      <h2 className={`${baseClassName}__title`}>{notification.title}</h2>
    );

    let footer = null;

    if (notification.additionalActions) {
      const additionalActionEls = notification.additionalActions.map(action => {
        return (
          <Button
            fullWidth={true}
            label={action.label}
            variant={action.primary ? 'primary' : null}
            onClick={action.onClick}
          />
        );
      });
      footer = (
        <ButtonGroup mergeTop mergeBottom mergeSides>
          {additionalActionEls}
        </ButtonGroup>
      );
    }

    return (
      <Modal footer={footer} onClose={this.onCloseModal}>
        {header}
        <p>{notification.content}</p>
      </Modal>
    );
  }
};

export default translate()(NotificationModal);