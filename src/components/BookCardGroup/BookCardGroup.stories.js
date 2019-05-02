import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import BookCardGroup from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('BookCardGroup', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const href = text('URL', '#reading-list');
  const count = number('Number of Books', 4, {
     range: true,
     min: 0,
     max: 4,
     step: 1,
  });

  const books = Array.apply(null, {length: count}).map((n, i) => {
    return {
      title: `The Elephant in the Room ${i}`,
      slug: `the-elephant-in-the-room-${i}`,
      coverImage: imageObject,
      language: 'English',
      level: 1,
      authors: [
        {name: 'Sam Wilson', slug: '/users/sam-wilson'}
      ]
    };
  });

  return <BookCardGroup books={books} href={href} />
});
