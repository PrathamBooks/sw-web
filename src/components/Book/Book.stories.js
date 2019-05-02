import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, object, boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Book from '.';
import { imageObject } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class BookWithViewport extends Component {
  render() {
    return <Book viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('Book', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;

  const offline = boolean('Offline?', false);
  const availableOffline = boolean('Book Available Offline?', false);
  const title = text('Title', 'Somewhere in the desert');
  const slug = text('Slug', 'somewhere-in-the-desert');
  const language = text('Language', 'English');
  const level = text('Level', 2);
  const recommended = boolean('Recommended?');
  const numberOfPeople = number('Number of Authors', 3, {
     range: true,
     min: 1,
     max: 12,
     step: 1,
  });
  const people = Array.apply(null, {length: numberOfPeople}).map((n, i) => {
    return {name: `Sam Wilson ${i}`, slug: `/sam-wilson-${i}`};
  });

  const likesCount = number('Likes', 20);
  const readsCount = number('Reads', 100);
  const readingListMembershipCount = number('Reading Lists Count', 10);

  const description = text('Description', 'These stories talk about seasons in an Indian context, often linking the seasons to particular festivals which certain communities celebrate at that time of year, and particular foods which are eaten. You can use these books to talk about diversity across India, introduce the difference between ‘weather’ and ‘seasons’ and to encourage children to think about their immediate context in relation to wider contexts.');

  const availableLanguages = object('Available Lanuages', [
    {
      name: "हिंदी",
      level: "1",
      slug: "hindi-2"
    },
    {
      name: "हिंदी",
      level: "2",
      slug: "hindi-2"
    },
    {
      name: "தமிழ்",
      level: "1",
      slug: "tamil-1"
    },
  ]);

  const tags = object('Tags', [
    "Animals",
    "Moral",
    "Folklores",
    "Village",
    "Wildlife"
  ]);

  const numberOfBooks = number('Number of Books', 8, {
     range: true,
     min: 0,
     max: 12,
     step: 1,
  });

  const books = Array.apply(null, {length: numberOfBooks}).map((n, i) => {
    return {
      title: `The Elephant in the Room ${i}`,
      slug: `the-elephant-in-the-room-${i}`,
      coverImage: imageObject,
      language: 'English',
      level: Math.floor(Math.random() * 4 + 1),
      authors: [
        {name: 'Sam Wilson', slug: '/sam-wilson'},
        {name: 'Sam Wilson II', slug: '/sam-wilson-ii'}
      ],
      howToUse: 'This story is about this, which can be read to them…'
    };
  });

  return <BookWithViewport
    offline={offline}
    availableOffline={availableOffline}
    authors={people}
    illustrators={people}
    originalAuthors={people}
    coverImage={imageObject}
    title={title}
    slug={slug}
    level={level}
    language={language}
    recommended={recommended}
    likesCount={likesCount}
    readsCount={readsCount}
    readingListMembershipCount={readingListMembershipCount}
    description={description}
    availableLanguages={availableLanguages}
    tags={tags}
    onClickAddToOffline={action('add-to-offline-clicked')}
    onClickRemoveFromOffline={action('remove-from-offline-clicked')}
    similarBooks={books}/>
});
