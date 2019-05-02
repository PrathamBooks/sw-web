import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import SectionCallToAction from '.';

setAddon(JSXAddon);

const stories = storiesOf('SectionCallToAction', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Want to see something boring?');
  const href = text('href', '#want-to-see-something-boring');
  const borderBottom = boolean('Border at Bottom?');

  return <SectionCallToAction label={label} href={href} borderBottom={borderBottom} />;
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const label = text('Label', 'Want to see something boring?');
  const href = text('href', '#want-to-see-something-boring');
  const borderBottom = boolean('Border at Bottom?');

  return <SectionCallToAction label={label} href={href} borderBottom={borderBottom} theme="light"/>
});
