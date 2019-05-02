import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs';

import Loader from '.';

setAddon(JSXAddon);

const stories = storiesOf('Loader', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const size = select('Size', {
    m: 'M',
    s: 'S',
    l: 'L',
    xl: 'XL'
  }, 'm');

  return <Loader size={size} />
});
