import React from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';

const DeleteModal = ({ onConfirm, onClose, viewport, t, count, baseClassName }) => {
  const footer = (
    <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
      <Button label={t('DeleteModal.delete')} variant="primary" onClick={() => {
        onConfirm()
        onClose()
      }} />
      <Button label={t('DeleteModal.dont-delete')} onClick={onClose} />
    </ButtonGroup>
  );

  return (
    <Modal footer={footer} onClose={onClose}>
      <h2 className={`${baseClassName}__delete-modal-title`}>{t('DeleteModal.title', count)}</h2>
      <p>{t("DeleteModal.warning")}</p>
    </Modal>
  );
};

export default translate()(DeleteModal);
