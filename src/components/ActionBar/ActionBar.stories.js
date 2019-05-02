import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import ActionBar, { ActionBarSection } from '.';

setAddon(JSXAddon);

const stories = storiesOf('ActionBar', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const noTopBorder = boolean('Remove Top Border?');
  const noBottomBorder = boolean('Remove Bottom Border?');
  const noSectionSeparators = boolean('Remove section separators?');
  const sections = number('Number of sections', 3, {
     range: true,
     min: 1,
     max: 6,
     step: 1,
  });
  const disabled = boolean('Disabled?');

  const sectionEls = Array.apply(null, {length: sections}).map((n, i) => {
    return (<ActionBarSection>ActionBarSection {i} <a href="http://example.com/">Dummy Link</a></ActionBarSection>)
  });

  return (
    <ActionBar
      noTopBorder={noTopBorder}
      noBottomBorder={noBottomBorder}
      disabled={disabled}
      noSectionSeparators={noSectionSeparators}
      >
      {sectionEls}
    </ActionBar>
  );
});
