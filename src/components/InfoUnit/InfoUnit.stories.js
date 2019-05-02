import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import InfoUnit from '.';

setAddon(JSXAddon);

const stories = storiesOf('InfoUnit', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Name');
  const children = text('Content', 'Jane Doe');
  const noWrap = boolean('No wrap?');

  return <InfoUnit label={label} noWrap={noWrap}>{children}</InfoUnit>
});
