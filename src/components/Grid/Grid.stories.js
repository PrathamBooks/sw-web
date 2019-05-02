import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select, number } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Grid from '.';

setAddon(JSXAddon);

const sampleText = [`A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street.`,`I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.`];

const stories = storiesOf('Grid', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const variant = select('Variant', {
    '1up': '1up',
    '2up': '2up',
    '3up': '3up',
    '4up': '4up',
    '6up': '6up',
    '2up-6up': '2up-6up'
  }, '2up');

  const items = number('Items', 6, {
     range: true,
     min: 1,
     max: 15,
     step: 1,
  });

  const itemEls = Array.apply(null, {length: items}).map((n, i) => {
    return (<div>{sampleText[i%2]}</div>);
  });

  return <Grid variant={variant}>{itemEls}</Grid>;
});
