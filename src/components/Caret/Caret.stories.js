import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Caret from '.';

setAddon(JSXAddon);

const stories = storiesOf('Caret', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const direction = select('Direction', {
    down: 'Down',
    left: 'Left',
    right: 'Right',
    up: 'Up'
  }, 'down');

  return <Caret direction={direction} />
});
