import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import BookCard from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('BookCard', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const recommended = boolean('Recommended?');
  const disabled = boolean('Disabled?');
  const shouldDisplayMenu = boolean('Show Menu?', true);
  const shouldDisplayFaded = boolean('Show Faded?', false);
  const fontSize = select('Font Size', {
    'm': 'M',
    'l': 'L'
  }, 'm');
  const title = text('Title', 'The Elephant in the Room');
  const coverImage = object('Cover Image', imageObject);
  const language = text('Language', 'English');
  const level = select('Reading Level', {
    1: 'Level 1',
    2: 'Level 2',
    3: 'Level 3',
    4: 'Level 4'
  }, 2);
  const slug = text('slug', 'the-elephant-in-the-room');
  const authors = object('Authors', [
    {name: 'Sam Wilson', slug: '/users/sam-wilson'},
    {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
  ]);
  const contest = object('Contest', {
    "name": "Retell, Remix, Rejoice 2016",
    "slug": "1-retell-remix-rejoice-2016",
    "won": true
  });

  return <BookCard
    title={title}
    coverImage={coverImage}
    language={language}
    level={level}
    slug={slug}
    recommended={recommended}
    contest={contest}
    authors={authors}
    fontSize={fontSize}
    onClick={action('book-card-clicked')}
    disabled={disabled}
    shouldDisplayMenu={shouldDisplayMenu}
    faded={shouldDisplayFaded} />
});
