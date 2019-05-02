import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select, color, boolean } from '@storybook/addon-knobs';
import icons from '../../../.storybook/icons.js';

import SvgIcon from '.';

setAddon(JSXAddon);

const stories = storiesOf('SvgIcon', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const fontColor = color("Parent Font Color", "#000");
  const name = select('Name', icons, Object.keys(icons)[0]);
  const pushLeft = boolean('Push Left?');
  const pushRight = boolean('Push Right?');
  const size = select('Size', {
    s: 'S',
    m: 'M (Default)',
    l: 'L',
    xl: 'XL',
    's-m': 'S-M',
    'm-l': 'M-L',
    'l-xl': 'L-XL',
    'xl-xxl': 'XL-XXL'
  }, 'm');

  const variant = select('Icon Variant', {
    'default': 'Default',
    'accent': 'Accent'
  }, 'default');

  return (
    <div style={{ color: fontColor }}>
      <SvgIcon name={name} size={size} pushLeft={pushLeft} pushRight={pushRight} variant={variant}/>
    </div>
  );
});
