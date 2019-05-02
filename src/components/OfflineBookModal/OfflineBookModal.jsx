import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import './OfflineBookModal.scss';
import { links } from '../../lib/constants';
import { connect } from 'react-redux';
import { removeOfflineBookModal, offlineBookModalClicked } from '../../redux/offlineBookModalAction';
import { changeOfflineBookPopUpStatusWorkflow, fetchMeWorkflow } from '../../redux/userActions';


const mapStateToProps = ({ offlineBookModal, user: { profile }, userFeedbackModal }) => {
  return {
    isVisible: offlineBookModal.isofflineModalVisible,
    userEmail: profile.email,
    isUserFeedbackModalVisible: userFeedbackModal.isUserFeedbackModalVisible
  }
}

const mapDispatchToProps = {
  removeOfflineBookModal,
  changeOfflineBookPopUpStatusWorkflow,
  offlineBookModalClicked,
  fetchMeWorkflow
};

@connect(mapStateToProps, mapDispatchToProps)

class OfflineBookModal extends Component {

  onFormLinkClicked = () => {
    this.props.offlineBookModalClicked(this.props.userEmail);
    this.props.changeOfflineBookPopUpStatusWorkflow()
      .then(this.props.fetchMeWorkflow);
    window.open(links.offlineBooksFormLink());
  }

  onCloseModal = () => {
    this.props.changeOfflineBookPopUpStatusWorkflow()
      .then(this.props.fetchMeWorkflow);
    this.props.removeOfflineBookModal();
  }

  render () {
    const { isVisible, t, isUserFeedbackModalVisible} = this.props;

    //To avoid overlapping of UserFeedbackModal and OfflineBookModal, show it only when UserFeedbackModal is closed
    if (!isVisible || isUserFeedbackModalVisible) {
      return null;
    }

    const header = (
      <h2>{t('OfflineBookModal.title')}</h2>
    );

    const footer = (
      <ButtonGroup mergeTop mergeBottom mergeSides>
        <Button
          fullWidth
          label={t('OfflineBookModal.popup-footer')}
          variant="primary"
          onClick={this.onFormLinkClicked}
        />
      </ButtonGroup>
    );

    return (
    <Modal  header={header} footer={footer} onClose={this.onCloseModal}>
      <p>{t('OfflineBookModal.popup')}</p>
    </Modal>
  );
  }
};

export default translate()(OfflineBookModal);