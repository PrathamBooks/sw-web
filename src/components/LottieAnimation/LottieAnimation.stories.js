import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import LottieAnimation from '.';

setAddon(JSXAddon);

const stories = storiesOf('LottieAnimation', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {

  const type = select('Type', {
    okay: 'okay  (Default)',
    like: 'like',
    love: 'love',
  }, 'okay');

  const isSelected = boolean('Select ?');

  return <LottieAnimation type={type} isSelected={isSelected}/>;
});
