import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
import { profileTypes } from '../../lib/constants';

import ProfileCard from '.';

setAddon(JSXAddon);

const stories = storiesOf('ProfileCard', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const type = select('Type', {
    [profileTypes.USER]: 'User',
    [profileTypes.ORGANISATION]: 'Organisation',
    [profileTypes.PUBLISHER]: 'Publisher'
  }, profileTypes.USER);

  const title = text('Title', 'Pratham Verma');
  const slug = text('Slug', '#pratham');
  const imageUrl = text('Avatar Image URL', 'http://via.placeholder.com/512x512?text=1:1');

  return <ProfileCard
    type={type}
    title={title}
    slug={slug}
    imageUrl={imageUrl}
    />
});
