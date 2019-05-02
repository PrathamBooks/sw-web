import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import HorizontalGrid from '.';

setAddon(JSXAddon);

const stories = storiesOf('HorizontalGrid', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const rows = number('Rows', 1, {
     range: true,
     min: 1,
     max: 3,
     step: 1,
  });

  const cellWidth = select('Cell Width', {
    'm': 'M',
    'l': 'L',
    'xl': 'XL',
    'xxl': 'XXL'
  }, 'm');

  const items = number('Items', 12, {
     range: true,
     min: 1,
     max: 25,
     step: 1,
  });

  const itemEls = Array.apply(null, {length: items}).map((n, i) => {
    return (<p><strong>{i + 1}</strong> A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>);
  });

  return <HorizontalGrid rows={rows} cellWidth={cellWidth}>{itemEls}</HorizontalGrid>
});
