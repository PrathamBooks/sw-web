import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs';

import Inliner from '.';

setAddon(JSXAddon);

const stories = storiesOf('Inliner', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  // const name = text('Label', 'initial value');
  const width = select('Width', {
    'xxxs': 'XXXS',
    'xxs': 'XXS',
    'xs': 'XS',
    's': 'S',
    'm': 'M',
    'l': 'L',
    'xl': 'XL',
    'xxl': 'XXL'
  }, 'm');

  return (
    <div>
      Some Text
      <Inliner width={width}>
        <div style={{padding: '.5em', backgroundColor: 'lightblue'}}>Hello world</div>
      </Inliner>
    </div>
  );
});
