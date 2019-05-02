import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import Link from '.';

setAddon(JSXAddon);

const stories = storiesOf('Link', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Nice');
  const legend = text('Legend');
  const fullWidth = boolean('FullWidth?');
  const disabled = boolean('Disabled?');
  const normal = boolean('Normal?');
  const theme = select('theme', {
    'default': 'Default',
    'light': 'Light',
    'info': 'Info',
    'danger': 'Danger',
    'warning': 'Warning',
    'success': 'Success',
    'dark': 'Dark'
  }, 'default');

  return (
    <Link
      href="#sample"
      legend={legend}
      fullWidth={fullWidth}
      disabled={disabled}
      normal={normal}
      theme={theme}
      >
        {label}
    </Link>
  );
});

stories.addWithJSX('With Click Handler', () => {
  const label = text('Label', 'Nice');
  const disabled = boolean('Disabled?');
  return <Link onClick={action("link-clicked")} disabled={disabled}>{label}</Link>
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const label = text('Label', 'Nice');
  const disabled = boolean('Disabled?');
  return <Link href="#sample" disabled={disabled} theme="light">{label}</Link>
});
