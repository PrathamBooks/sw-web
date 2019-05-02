import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Pill from '.';

setAddon(JSXAddon);

const stories = storiesOf('Pill', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Something Sensible');
  const icon = text('Icon', 'circle');
  const dismissable = boolean('Dismissable?');
  const href= text('href');
  const isCategoryPill = boolean('isCategoryPill?');

  return <Pill
    label={label}
    icon={icon}
    href={href}
    isCategoryPill={isCategoryPill}
    onClose={dismissable ? action('pill-close') : null} />
});
