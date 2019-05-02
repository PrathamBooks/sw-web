import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import Badge from '.';

setAddon(JSXAddon);

const stories = storiesOf('Badge', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const value = text('Value', '1');
  const theme = select('Theme', {
    'default': 'Default',
    'light': 'light',
  }, 'default');

  return <Badge value={value} theme={theme}/>
});
