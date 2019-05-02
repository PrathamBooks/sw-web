import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs , boolean } from '@storybook/addon-knobs';


import Rating from '.';

setAddon(JSXAddon);

const stories = storiesOf('Rating', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {

  const disabled = boolean('Disabled?');

  return <Rating disabled={disabled}/>

});
