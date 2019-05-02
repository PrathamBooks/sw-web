import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import SiteFooter from '.';

setAddon(JSXAddon);

const stories = storiesOf('SiteFooter', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const bgUrl = text('Background URL', 'http://via.placeholder.com/1024x512?text=image');

  return <SiteFooter bgUrl={bgUrl} />
});
