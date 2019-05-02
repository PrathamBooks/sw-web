import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ToggleSwitch from '.';

setAddon(JSXAddon);

const stories = storiesOf('ToggleSwitch', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const onLabel = text('ON Label', 'Label for ON');
  const offLabel = text('OFF Label', 'Label for OFF');

  return <ToggleSwitch
    onLabel={onLabel}
    offLabel={offLabel}
    id="storybook-toggle-switch"
    onChange={action('toggle-swtich-change')}
    />
});
