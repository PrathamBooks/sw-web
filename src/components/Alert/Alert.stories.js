import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Alert from '.';

setAddon(JSXAddon);

const stories = storiesOf('Alert', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const content = text('Content', '<h3>Message Title</h3><p>A slightly longer and meaningful text message.</p>');
  const theme = select('Theme', {
    'info': 'Info',
    'danger': 'Danger',
    'success': 'Success',
    'warning': 'Warning',
  }, 'info')

  return (
    <Alert theme={theme}>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </Alert>
  )
});
