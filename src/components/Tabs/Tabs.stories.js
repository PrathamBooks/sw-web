import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, select } from '@storybook/addon-knobs';

import Tab from '../Tab';
import Tabs from '.';

setAddon(JSXAddon);
const stories = storiesOf('Tabs', module);
stories.addDecorator(withKnobs);

const sampleText = "A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.";

stories.addWithJSX('Default', () => {
  const align = select('Align', {
    'center': 'Center (default)',
    'left': 'Left'
  }, 'center');
  const count = number('Number of Tabs', 4, {
     range: true,
     min: 1,
     max: 10,
     step: 1,
  });

  const colEls = Array.apply(null, {length: count}).map((n, i) => {
    return (<Tab key={i} title={`A title for the Tab ${i}`}>{i} {sampleText}</Tab>);
  });

  return (<Tabs align={align}>{colEls}</Tabs>);
});
