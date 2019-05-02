import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number, object, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import ReadingListCard from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('ReadingListCard', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const title = text('Title', 'A Great Reading List');
  const slug = text('Slug', 'a-great-reading-list');
  const count = number('Number of Books', 4, {
     range: true,
     min: 0,
     max: 100,
     step: 1,
  });
  const desc = text('Description', 'Millions of people now prefer wearing contact lenses over spectacles for the numerous benefits they provide. If you are considering shifting from your glasses to a new pair of contact lenses.');

  const owner = object('Owner of the list', {name: 'Sam Wilson', slug: '/users/sam-wilson'})
  const wide = boolean('Wide', false);

  const books = Array.apply(null, {length: (count > 4 ? 4 : count)}).map((n, i) => {
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

  return <ReadingListCard
    title={title}
    count={count}
    description={desc}
    slug={slug}
    owner={owner}
    books={books}
    wide={wide}/>
});
