import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import JSXAddon from 'storybook-addon-jsx';

import Button from '.';

setAddon(JSXAddon);

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'Nice');
  const iconLeft = text('Icon Left');
  const iconRight = text('Icon Right');
  const disabled = boolean('Disabled');
  const fullWidth = boolean('Full Width');
  const loading = boolean('Loading');
  const variant = select('Variant', {
    default: 'Default',
    primary: 'Primary',
    info: 'Info',
    danger: 'Danger',
    warning: 'Warning',
    success: 'Success'
  }, 'default');

  const size = select('Size', {
    m: 'M',
    s: 'S',
    l: 'L'
  }, 'm');

  return <Button
      label={label}
      iconLeft={iconLeft}
      iconRight={iconRight}
      disabled={disabled}
      fullWidth={fullWidth}
      loading={loading}
      variant={variant}
      size={size}
      onClick={action("button-clicked")}
    />
});
