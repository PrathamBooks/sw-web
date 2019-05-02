import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import ImageCard from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('ImageCard', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1.333333333;
  const title = text('Title', 'A nice title');
  const subTitle = text('Sub-title', 'A nice sub-title');
  const imageUrls = object('Image', imageObject);
  const isCollection = boolean('Collection of images?');
  const artist = object('Artist', [{
    name: 'Jane Doe',
    slug: '/users/jane-doe'
  },{
    name: 'Jane Doe 2',
    slug: '/users/jane-doe-2'
  }]);


  return <ImageCard
    title={title}
    subTitle={subTitle}
    image={imageUrls}
    isCollection={isCollection}
    slug={'image-slug'}
    artists={artist} />
});
