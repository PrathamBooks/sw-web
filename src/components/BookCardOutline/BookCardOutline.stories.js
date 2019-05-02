import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'
// import { action } from '@storybook/addon-actions';

import BookCardOutline from '.';

setAddon(JSXAddon);

const stories = storiesOf('BookCardOutline', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Add to offline Library');
  const icon = text('Icon', 'plus-circle');

  return <BookCardOutline
    icon={icon}
    label={label}
    />
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const label = text('Label', 'Add to offline Library');

  return <BookCardOutline
    label={label}
    theme="light"
    />
});
