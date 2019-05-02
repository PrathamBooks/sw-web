import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';

import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

import './ConfirmModal.scss';

class ConfirmModal extends Component {  
  render() {
    const {
      t,
      title,
      viewport,
      onClose,
      onConfirm,
    } = this.props;
    
    const headerEl = (
      <h2>{title || t('global.confirm')}</h2>
    );

    const footerEl = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          variant="primary"
          fullWidth
          label={t('global.yes')}
          onClick={() => onConfirm()}
        />
        <Button fullWidth label={t('global.close')} onClick={onClose} />
      </ButtonGroup>
    );
    
    return (
      <Modal
        header={headerEl}
        footer={footerEl}
        onClose={onClose}
      >
        {this.props.text}
      </Modal>
    );
  }
}

ConfirmModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired
};

export default translate()(ConfirmModal);
