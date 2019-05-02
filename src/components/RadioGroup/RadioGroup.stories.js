import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object, boolean} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import RadioGroup from '.';

setAddon(JSXAddon);

const stories = storiesOf('RadioGroup', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const radios = object('Radios', [
    { label: 'January', value: 'jan' },
    { label: 'February', value: 'feb' },
    { label: 'March', value: 'mar' }
  ]);
  const defaultValue = text('Default Value', 'feb');
  const disabled = boolean('Disabled?');

  return <RadioGroup
    radios={radios}
    defaultValue={defaultValue}
    disabled={disabled}
    onChange={action('radio-group-change')}
    name="storybook-radio-group-01"
    id="storybook-radio-group"/>
});
