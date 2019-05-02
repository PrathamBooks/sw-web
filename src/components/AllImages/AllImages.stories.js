import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { imageObject } from '../Img/Img.stories.js';

import AllImages from '.';


setAddon(JSXAddon);

const stories = storiesOf('AllImages', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1.3333333333333;
  const numberOfImages = number('Number of Images', 12, {
     range: true,
     min: 0,
     max: 12,
     step: 1,
  });
 const artists = [object('Multiple Artists', [
    {name: 'Sam Wilson', slug: '/users/sam-wilson'},
    {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
 ]), object('Single Artist', [
    {name: 'Amy Jackson', slug: '/users/amy-jackson'}
 ])];

  const images = Array.apply(null, {length: numberOfImages}).map((n, i) => {
    return {
      id: `image-${i}`,
      imageUrls: [ imageObject ],
      title: `Some sensible title ${i}`,
      subTitle: `Why not a sub title ${i} too?`,
      slug: `image-${i}`,
      isCollection: false,
      illustrators: artists[i%2],
    };
  });
  
  const illustrationsInfo = object('Illustrations Info', { illustrationsInfo: {
    hits: 100
  }}
  );

  return <AllImages images={images} illustrationsInfo={illustrationsInfo} onClickUpload={action('all-images-upload-clicked')}/>
});
