import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Checkbox from '.';

setAddon(JSXAddon);

const stories = storiesOf('Checkbox', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const checked = boolean('Checked?');
  const label = text('Label', 'Checkbox Label');
  const labelBold = boolean('Make label bold?');
  const legend = text('Legend');
  const disabled = boolean('Disabled?');
  const loading = boolean('Loading?');
  const value = text('Value', 'a-value');
  const radioIcon = boolean('Radio icon?');
  const inline = boolean('Inline?');

  return <Checkbox
    label={label}
    legend={legend}
    fontWeight={labelBold ? 'bold' : null}
    checked={checked}
    disabled={disabled}
    loading={loading}
    id="#test-checkbox"
    value={value}
    onChange={action('checkbox-changed')}
    radioIcon={radioIcon}
    inline={inline}
    />
});
