import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import FiltersBar from '.';

setAddon(JSXAddon);

const stories = storiesOf('FiltersBar', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const noTopBorder = boolean('No Top Border?', false);

  return <FiltersBar noTopBorder={noTopBorder}/>
});
