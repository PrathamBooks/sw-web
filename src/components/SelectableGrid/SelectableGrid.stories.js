import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, select, boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SkeletonBookCard from '../SkeletonBookCard';

import SelectableGrid from '.';

setAddon(JSXAddon);

const stories = storiesOf('SelectableGrid', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const variant = select('Variant', {
    '1up': '1up',
    '2up': '2up',
    '3up': '3up',
    '4up': '4up',
    '6up': '6up',
    '2up-6up': '2up-6up'
  }, '3up');

  const label = text('Label', 'Select book to delete');
  const theme = text('Theme', 'danger');
  const rotateOnActive = boolean('Rotate On Active?', true);
  const roundedCorners = boolean('Rounded Corners?', true);

  const items = number('Number of Items', 12, {
     range: true,
     min: 0,
     max: 20,
     step: 1,
  });

  const itemEls = Array.apply(null, {length: items}).map((n, i) => {
    return (<SkeletonBookCard key={i} value={`id-${i}`} />);
  });

  return <SelectableGrid
    id="storybook-test-selectable-grid"
    variant={variant}
    label={label}
    rotateOnActive={rotateOnActive}
    roundedCorners={roundedCorners}
    theme={theme}
    onChange={action('selectable-grid-change')}>
    {itemEls}
  </SelectableGrid>;
});
