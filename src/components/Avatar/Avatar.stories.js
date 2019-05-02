import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import Avatar from '.';

setAddon(JSXAddon);

const stories = storiesOf('Avatar', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const url = text('Image URL', 'http://via.placeholder.com/512x512?text=1:1');
  const name = text('Name', 'Jane Doe');
  const size = select('Size', {
    'm': 'M',
    'l': 'L'
  }, 'm');

  const variant = select('Variant', {
    'default': 'Default',
    'circular': 'Circular'
  }, 'default');

  return <Avatar url={url} name={name} size={size} variant={variant} />
});
