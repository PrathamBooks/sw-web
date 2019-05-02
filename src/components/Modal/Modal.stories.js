import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, number, select} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';

import Modal from '.';

setAddon(JSXAddon);

const stories = storiesOf('Modal', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const background = select('Background', {
    'default': 'Default',
    'transparent': 'Transparent'
  }, 'default');

  const footer = boolean('Footer?');
  const header = boolean('Header?');
  const fillViewport = boolean('Fill Viewport?');
  const noDimensionRestrictions = boolean('No dimension restrictions?');
  const onClose = boolean('Handle onClose?');

  const headerEl = <p>Title</p>;

  const footerEls = (
    <ButtonGroup mergeTop mergeBottom mergeSides>
      <Button
        fullWidth={true}
        label="Close"
        variant="default"
      />

      <Button
        fullWidth={true}
        label="Apply"
        variant="primary"
      />
    </ButtonGroup>
  );

  const sections = number('Sample Content Length', 3, {
     range: true,
     min: 1,
     max: 12,
     step: 1,
  });

  const sectionEls = Array.apply(null, {length: sections}).map((n, i) => {
    return (<p key={i}>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>)
  });

  return (
    <Modal
      background={background}
      fillViewport={fillViewport}
      noDimensionRestrictions={noDimensionRestrictions}
      header={header ? headerEl : null}
      footer={footer ? footerEls : null}
      onClose={onClose ? action('modal-close-clicked') : null}>
      {sectionEls}
    </Modal>
  );
});
