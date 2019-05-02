import React from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';
import { gaEventCategories, gaEventActions } from '../../lib/constants';

const DeleteModal = ({onConfirm,
                      onClose,
                      viewport,
                      t,
                      count,
                      books,
                      userEmail,
                      recordGaEvents,
                      addSlimNotification,
                      baseClassName }) => {

  const footer = (
    <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
      <Button label={t('DeleteModal.delete')} variant="primary" onClick={() => {
        onConfirm()
        books.forEach(
          book => recordGaEvents({
            eventCategory: gaEventCategories.offline,
            eventAction: gaEventActions.delete,
            userEmail: userEmail,
            dimension2: book.level,
            dimension3: book.language,
            dimension5: book.slug,
            metric2: -1
          })
        )
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
