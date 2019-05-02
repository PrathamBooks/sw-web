import React from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';
import TextField from '../TextField';


const EmbedModal = ({ isVisible, onCloseClick, orientation, slug, viewport, t }) => {
  if (!isVisible) {
    return null;
  }

  const header = (
    <h2>{t('Book.embed')}</h2>
  );

  const footer = (
    <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
      <Button variant="primary" fullWidth label={t('global.close')} onClick={onCloseClick} />
    </ButtonGroup>
  );

  let dimensionsText;
  if (orientation === 'portrait') {
    dimensionsText = 'height: 365px; width: 513px;';
  } else if (orientation === 'landscape') {
    dimensionsText = 'height: 513px; width: 365px;';
  }

  const embedText = `<iframe src="https://storyweaver.org.in/stories/show-in-iframe/${slug}?iframe=true" style="${dimensionsText}" allowfullscreen webkitallowfullscreen mozallowfullscreen>`;

  return (
    <Modal header={header} footer={footer} onClose={onCloseClick}>
      <p>{t('Book.embed-legend')}</p>
      <TextField
        label={t('Book.embed-label')}
        type="multiline"
        value={embedText}
        fontFamily="monospace"
        />
    </Modal>
  );
};

export default translate()(EmbedModal);
