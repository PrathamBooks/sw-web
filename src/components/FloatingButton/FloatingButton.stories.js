import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import FloatingButton from '.';

setAddon(JSXAddon);

const stories = storiesOf('FloatingButton', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const icon = text('Icon', 'filter');
  const count = number('Count');

  return <FloatingButton
    icon={icon}
    count={count}
    onClick={action('floating-button-clicked')}/>
});
