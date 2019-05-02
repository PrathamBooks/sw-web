import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';
import icons from '../../../.storybook/icons.js';

import SvgSymbol from '.';

setAddon(JSXAddon);

const stories = storiesOf('SvgSymbol', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const name = select('Name', icons, Object.keys(icons)[0]);
  const parentClassName = text('Parent Class Names', null);
  const viewBox = boolean('View Box', false);

  return <SvgSymbol name={name} includeViewBox={viewBox} parentClassName={parentClassName} />
});
