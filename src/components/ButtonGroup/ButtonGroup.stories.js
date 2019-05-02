import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Button from '../Button';

import ButtonGroup from '.';

setAddon(JSXAddon);

const stories = storiesOf('ButtonGroup', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const numberOfButtons = number('Number of Buttons', 2, {
     range: true,
     min: 1,
     max: 3,
     step: 1,
  });
  const mergeTop = boolean('Merge Top?');
  const mergeBottom = boolean('Merge Bottom?');
  const mergeSides = boolean('Merge Sides?');

  const buttonEls = Array.apply(null, {length: numberOfButtons}).map((n, i) => {
    return (<Button label={`Button ${i}`} onClick={action(`button-${i}-clicked`)} />)
  });

  return <ButtonGroup
    mergeTop={mergeTop}
    mergeBottom={mergeBottom}
    mergeSides={mergeSides}>
      {buttonEls}
  </ButtonGroup>;
});
