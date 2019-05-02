import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import icons from '../../../.storybook/icons.js';

import Notification from '.';

setAddon(JSXAddon);

const stories = storiesOf('Notification', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const type = select('Type', {
    'info': 'Info (Default)',
    'danger': 'Danger',
    'success': 'Success',
    'warning': 'Warning',
  }, 'info');
  const title = text('Title', 'This happened');
  const content = text('Content', 'You can do this and that. But, for now how about choosing one of these actions?');
  const iconName = select('Icon Name', {...icons});
  const dismissLabel = text('Dismiss Label', 'Dismiss');
  const confirmLabel = text('Confirm Label', 'Confirm');

  return <Notification
    type={type}
    iconName={iconName}
    title={title}
    content={content}
    onDismiss={action("notification-dismiss-clicked")}
    dismissLabel={dismissLabel}
    onConfirm={action("notification-dismiss-clicked")}
    confirmLabel={confirmLabel}
    />;
});
