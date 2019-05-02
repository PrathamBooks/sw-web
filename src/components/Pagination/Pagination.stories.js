import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Pagination from '.';

setAddon(JSXAddon);

const stories = storiesOf('Pagination', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label');

  return <Pagination label={label} onClick={action('load-more-clicked')} />
});
