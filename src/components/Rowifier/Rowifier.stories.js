import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, select, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Rowifier from '.';

setAddon(JSXAddon);

const stories = storiesOf('Rowifier', module);

stories.addDecorator(withKnobs);

const sampleText = "A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.";

stories.addWithJSX('Default', () => {
  const items = number('Items', 3, {
     range: true,
     min: 1,
     max: 15,
     step: 1,
  });

  const align = select('Align', {
    'left': 'Left',
    'center': 'Center',
    'right': 'Right',
  }, 'left')

  const separator = boolean('Separator?');
  const borderBottom = boolean('Border Bottom?');
  const borderTop = boolean('Border Top?');
  
  const itemEls = Array.apply(null, {length: items}).map((n, i) => {
    return (<p>{i} {sampleText}</p>);
  });

  return (
    <Rowifier
      align={align}
      separator={separator}
      borderTop={borderTop}
      borderBottom={borderBottom}
      >
      {itemEls}
    </Rowifier>
  );
});
