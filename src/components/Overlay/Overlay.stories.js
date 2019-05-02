import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Overlay from '.';

setAddon(JSXAddon);

const stories = storiesOf('Overlay', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const theme = select('Variant', {
    'dark': 'Dark',
    'light': 'Light'
  }, 'dark');

  return <Overlay onClick={action('overlay-clicked')} theme={theme}/>
});
