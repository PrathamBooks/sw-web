import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
// import { withKnobs, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import ConfirmModal from '.';

setAddon(JSXAddon);

const stories = storiesOf('ConfirmModal', module);

// stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  // const name = text('Label', 'initial value');

  return <ConfirmModal />
});
