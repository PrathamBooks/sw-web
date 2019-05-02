import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';

import Home from '.';

import { imageObject } from '../Img/Img.stories.js';
import { samplePosts } from '../BlogPosts/BlogPosts.stories.js';
import { slide } from '../HeroCarousel/HeroCarousel.stories.js';

const cardImageObject = {...imageObject, aspectRatio: 1};
const sampleBookCard = {
  title: `The Elephant in the Room`,
  slug: `the-elephant-in-the-room`,
  coverImage: cardImageObject,
  language: 'English',
  level: 1,
  authors: [
    {name: 'Sam Wilson', slug: '/users/sam-wilson'},
    {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
  ]
}

setAddon(JSXAddon);

const stories = storiesOf('Home', module);

stories.addWithJSX('Default', () => {

  const books = Array.apply(null, {length: 12}).map((n, i) => {
    return {
      ...sampleBookCard,
      title: `${sampleBookCard.title} ${i}`,
      slug: `${sampleBookCard.slug}-${i}`,
      level: Math.floor(Math.random() * 4 + 1)
    };
  });

  const readingListSuggestions = Array.apply(null, {length: 3}).map((n, i) => {
    return {
      title: 'A Great Reading List',
      slug: 'a-great-reading-list',
      owner: {name: 'Sam Wilson', slug: '/users/sam-wilson'},
      books,
      count: books.length
    };
  });

  const slides = Array.apply(null, {length: 6}).map((n, i) => {
    return slide;
  });

  return <Home
    heroCarouselSlides={slides}
    blogPosts={samplePosts}
    bookSuggestions={books}
    bookSelections={[
      {
        title: 'Editor’s Picks',
        href: '#editor-s-picks',
        books: books
      },
      {
        title: 'New Arrivals',
        href: '#new-arrivals',
        books: books
      },
      {
        title: 'Most Read',
        href: '#most-read',
        books: books
      }
    ]}
    readingListSuggestions={readingListSuggestions}
    />
});
