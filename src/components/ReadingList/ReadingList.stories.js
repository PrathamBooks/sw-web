import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ReadingList from '.';
import { imageObject } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class ReadingListWithViewport extends Component {
  render() {
    return <ReadingList viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('ReadingList', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const liked = boolean('Liked?');
  const editable = boolean('Editable');
  const editActive = boolean('Edit Active');
  const title = text('Title', 'My favorite 10 childrens books of all time');
  const description = text('Description', 'These stories talk about seasons in an Indian context, often linking the seasons to particular festivals which certain communities celebrate at that time of year, and particular foods which are eaten. You can use these books to talk about diversity across India, introduce the difference between ‘weather’ and ‘seasons’ and to encourage children to think about their immediate context in relation to wider contexts.');
  const slug = text('Slug', '#slug');
  const author = object('List Author', {
    name: 'Sam Wilson',
    slug: '#sam-wilson',
    profileImage: 'http://via.placeholder.com/512x512?text=1:1'
  });

  const numberOfBooks = number('Number of Books', 4, {
     range: true,
     min: 0,
     max: 25,
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
        {name: 'Sam Wilson', slug: '/users/sam-wilson'},
        {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
      ],
      description: 'These stories talk about seasons in an Indian context, often linking the seasons to particular festivals which certain communities celebrate at that time of year, and particular foods which are eaten. You can use these books to talk about diversity across India, introduce the difference between ‘weather’ and ‘seasons’ and to encourage children to think about their immediate context in relation to wider contexts.',
      howToUse: 'This story is about this, which can be read to them…'
    };
  });

  const readCount = number('Read Count', 30);
  const likeCount = number('Like Count', 10);

  return <ReadingListWithViewport
    readingList={{
      title,
      books,
      description,
      slug,
      author,
      likeCount,
      readCount,
      liked
    }}
    editable={editable}
    editActive={editActive}
    onCancel={action('edit-cancel-clicked')}
    onLikeButtonClicked={action('like-button-clicked')}
    onEdit={action('edit-clicked')}
    onSave={action('save-clicked')}/>
});
