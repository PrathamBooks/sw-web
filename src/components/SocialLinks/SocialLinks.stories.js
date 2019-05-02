import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import SocialLinks from '.';

setAddon(JSXAddon);

const stories = storiesOf('SocialLinks', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const twitter = text('Twitter URL', '#twitter');
  const facebook = text('Facebook URL', '#facebook');
  const rss = text('RSS Feed URL', '#rss');
  const youtube = text('YouTube Feed URL', '#youtube');

  const links = {
    twitter,
    facebook,
    rss,
    youtube
  };

  const variant = select('Variant', {
    'default': 'Default',
    'circular': 'Circular'
  }, 'default');

  return <SocialLinks links={links} variant={variant} />
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const twitter = text('Twitter URL', '#twitter');
  const facebook = text('Facebook URL', '#facebook');
  const rss = text('RSS Feed URL', '#rss');
  const youtube = text('YouTube Feed URL', '#youtube');

  const links = {
    twitter,
    facebook,
    rss,
    youtube
  };

  const variant = select('Variant', {
    'default': 'Default',
    'circular': 'Circular'
  }, 'default');

  return <SocialLinks links={links} variant={variant} theme="light" />
});
