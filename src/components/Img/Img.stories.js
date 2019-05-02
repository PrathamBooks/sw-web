import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Img from '.';

setAddon(JSXAddon);

const stories = storiesOf('Img', module);

stories.addDecorator(withKnobs);

export const imageObjectLandscape = {
  aspectRatio: 1.333333333,
  cropCoords: {
    x: 0,
    y: 0
  },
  sizes: [
    {
      height: 128,
      width: 268,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size1/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 148,
      width: 308,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size2/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 205,
      width: 428,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size3/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 263,
      width: 548,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size4/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 339,
      width: 708,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size5/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 385,
      width: 803,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size6/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 460,
      width: 959,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size7/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    }
  ]
};

export const imageObjectPortrait = {
  "aspectRatio": 1.3333333333333333,
  "cropCoords": {
    x: 0,
    y: 0.36
  },
  "sizes": [
  {
      "height": 1542.0,
      "width": 1073.0,
      "url": "https://storage.googleapis.com/storyweaver-sw2-full/illustrations/5760/large/3.jpg?1490856230"
  },
  {
      "height": 374.0,
      "width": 260.0,
      "url": "https://storage.googleapis.com/storyweaver-sw2-full/illustrations/5760/search/3.jpg?1490856230"
  }]
};

export const imageObject = imageObjectLandscape;

stories.addWithJSX('Default', () => {
  const portrait = boolean('Portrait?');
  const altText = text('Alt', 'some nice alt text');
  const useNativeAspectRatio = boolean('Use native aspect ratio?');
  const debug = boolean('Debug?');

  return <Img
    image={portrait ? imageObjectPortrait : imageObjectLandscape}
    alt={altText}
    useNativeAspectRatio={useNativeAspectRatio}
    debug={debug}/>
});
