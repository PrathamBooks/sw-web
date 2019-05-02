import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
// import { withKnobs, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import AllLists from '.';

setAddon(JSXAddon);

const stories = storiesOf('AllLists', module);

// stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  // const name = text('Label', 'initial value');

  return <AllLists />
});
