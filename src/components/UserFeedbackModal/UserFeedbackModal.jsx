import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import './UserFeedbackModal.scss';
import { feedbackLinks } from '../../lib/constants';
import { connect } from 'react-redux';
import { removeUserFeedbackModal, userFeedbackModalClicked } from '../../redux/userFeedbackModalAction';
import { changeUserFeedbackModalStatusWorkflow, fetchMeWorkflow } from '../../redux/userActions';


const mapStateToProps = ({ userFeedbackModal, user: { profile } }) => {
  return {
    isVisible: userFeedbackModal.isUserFeedbackModalVisible,
    userEmail: profile.email,
    feedbackType: userFeedbackModal.feedbackType,
    eventLabel: userFeedbackModal.eventLabel,
  }
}

const mapDispatchToProps = {
  changeUserFeedbackModalStatusWorkflow,
  userFeedbackModalClicked,
  fetchMeWorkflow,
  removeUserFeedbackModal
};

@connect(mapStateToProps, mapDispatchToProps)

class UserFeedbackModal extends Component {

  onFormLinkClicked = () => {
    const {
      userFeedbackModalClicked,
      userEmail,
      changeUserFeedbackModalStatusWorkflow,
      feedbackType,
      fetchMeWorkflow,
      eventLabel
    } = this.props;
    userFeedbackModalClicked({userEmail, feedbackType, eventLabel});
    changeUserFeedbackModalStatusWorkflow(feedbackType)
      .then(fetchMeWorkflow);
    window.open(feedbackLinks[feedbackType]);
  }

  onCloseModal = () => {
    this.props.changeUserFeedbackModalStatusWorkflow(this.props.feedbackType)
      .then(this.props.fetchMeWorkflow);
    this.props.removeUserFeedbackModal();
  }

  render () {
    const { isVisible, t, feedbackType} = this.props;
 
    if (!isVisible) {
      return null;
    }

    const header = (
      <h2>{t(`UserFeedbackModal.title-${feedbackType}`)}</h2>
    );

    const footer = (
      <ButtonGroup mergeTop mergeBottom mergeSides>
        <Button
          fullWidth
          label={t(`UserFeedbackModal.popup-footer-${feedbackType}`)}
          variant="primary"
          onClick={this.onFormLinkClicked}
        />
      </ButtonGroup>
    );

    return (
    <Modal  header={header} footer={footer} onClose={this.onCloseModal}>
      <p>{t(`UserFeedbackModal.popup-${feedbackType}`)}</p>
    </Modal>
  );
  }
};

export default translate()(UserFeedbackModal);