import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, array, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Columnizer from '.';

setAddon(JSXAddon);

const stories = storiesOf('Columnizer', module);

stories.addDecorator(withKnobs);

const sampleText = `A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.`

stories.addWithJSX('Default', () => {
  const noGutter = boolean('No Gutter?');
  const children = number('Children', 3, {
     range: true,
     min: 1,
     max: 10,
     step: 1,
  });

  const colEls = Array.apply(null, {length: children}).map(n => {
    return (<div>{sampleText}</div>);
  });

  return (
    <Columnizer noGutter={noGutter}>
      {colEls}
    </Columnizer>
  );
});

stories.addWithJSX('with Column Count', () => {
  const children = number('Children', 3, {
     range: true,
     min: 1,
     max: 10,
     step: 1,
  });

  const columns = number('Columns', 3, {
     range: true,
     min: 1,
     max: 10,
     step: 1,
  });

  const colEls = Array.apply(null, {length: children}).map(n => {
    return (<div>{sampleText}</div>);
  });

  return (
    <Columnizer columns={columns}>
      {colEls}
    </Columnizer>
  );
});

stories.addWithJSX('with Column Widths', () => {
  const children = number('Children', 3, {
     range: true,
     min: 1,
     max: 10,
     step: 1,
  });

  const columns = array('Columns Widths', ['20%', '80%']);

  const colEls = Array.apply(null, {length: children}).map(n => {
    return (<div>{sampleText}</div>);
  });

  return (
    <Columnizer columns={columns}>
      {colEls}
    </Columnizer>
  );
});
