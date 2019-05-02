import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import ModalControlButton from '.';

setAddon(JSXAddon);

const stories = storiesOf('ModalControlButton', module);

stories.addDecorator(withKnobs);
stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Default', () => {
  const icon = text('Icon', 'chevron-right');
  const label = text('Label', 'Next');
  const size = select('Size', {
    m: 'M',
    s: 'S',
    l: 'L',
    xl: 'XL'
  }, 'm');

  return (
    <ModalControlButton
      icon={icon}
      label={label}
      size={size}
      onClick={action('modal-control-button-clicked')}
      />
  );
});
