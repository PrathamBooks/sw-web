import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Stat from '.';

setAddon(JSXAddon);

const stories = storiesOf('Stat', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const icon = text('Icon', 'heart-outline');
  const value = number('Value', 10);
  const label = text('Label', 'views');
  const enableOnClick = boolean('With onClick');
  const size = select('Size', {
    's': 'S',
    'm': 'M (default)',
    'l': 'L'
  }, 'm');
  const align = select('Align', {
    'left': 'Left (default)',
    'center': 'Center'
  }, 'left');
  const iconVariant = select('Icon Variant', {
    'default': 'Default',
    'accent': 'Accent'
  }, 'default');

  return <Stat
    icon={icon}
    value={value}
    label={label}
    iconVariant={iconVariant}
    align={align}
    size={size}
    onClick={enableOnClick ? action('stat-clicked') : null}/>
});
