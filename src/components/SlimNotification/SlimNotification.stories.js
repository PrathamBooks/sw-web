import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import icons from '../../../.storybook/icons.js';

import SlimNotification from '.';

setAddon(JSXAddon);

const stories = storiesOf('SlimNotification', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const type = select('Type', {
    'info': 'Info (Default)',
    'danger': 'Danger',
    'success': 'Success'
  }, 'info');
  const content = text('Content', 'You can do this and that. ');

  return <SlimNotification
    type={type}
    content={content}
    onDismiss={action("slim-notification-dismiss-clicked")}
    />;
});
