import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Button from '../Button';
import FloatingActionsBar from '.';

setAddon(JSXAddon);

const stories = storiesOf('FloatingActionsBar', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const float = boolean('Float active?', true);

  return (
    <FloatingActionsBar float={float}>
      <Button
        iconLeft="check"
        label="Save"
        variant="primary"
      />

      <Button
        iconLeft="close"
        label="Cancel"
      />
    </FloatingActionsBar>
  )
});
