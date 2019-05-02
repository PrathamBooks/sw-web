import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';

import Dropdown from '.';
import Link from '../Link';

setAddon(JSXAddon);

const stories = storiesOf('Dropdown', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const content = text('Drop down Content', '<p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>');
  const align = select('Align', {
    'left': 'Left',
    'right': 'Right'
  }, 'right');
  const minWidth = select('Min Width', {
    'm': 'M (Default)',
    'l': 'L',
    'xl': 'XL',
    'xxl': 'XXL'
  }, 'm');
  const disabled = boolean('Disabled?');
  const noPadding = boolean('No padding?');

  return <Dropdown
    toggleEl={<Link>Toggle Dropdown</Link>}
    align={align}
    noPadding={noPadding}
    disabled={disabled}
    minWidth={minWidth}>
      <div dangerouslySetInnerHTML={{__html: content}} />
    </Dropdown>
});
