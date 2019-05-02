import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, select } from '@storybook/addon-knobs';

import BookCard from '../BookCard';
import ImageCard from '../ImageCard';

import CardShelf from '.';
import { imageObject } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class CardShelfWithViewport extends Component {
  render() {
    return <CardShelf viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('CardShelf', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const cardType = select('Type of Card', {
    'book': 'BookCard',
    'image': 'ImageCard'
  }, 'image');
  const items = number('Number of Items', 12, {
     range: true,
     min: 0,
     max: 12,
     step: 1,
  });

  const booksEl = Array.apply(null, {length: items}).map((n, i) => {
    const image = Object.assign({}, imageObject, {aspectRatio: 1});

    return <BookCard
              title={`The Elephant in the Room ${i}`}
              slug={`the-elephant-in-the-room-${i}`}
              coverImage={image}
              language={'English'}
              level={Math.floor(Math.random() * 4 + 1)}
              authors={[
                {name: 'Sam Wilson', slug: '/users/sam-wilson'},
                {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
              ]}
              />
  });

  const imagesEl = Array.apply(null, {length: items}).map((n, i) => {
    const image = Object.assign({}, imageObject, {aspectRatio: 1.333333333});

    return <ImageCard
              title={`A nice title ${i}`}
              slug={`a-nice-title-${i}`}
              image={image}
              artist={{name: 'Sam Wilson', slug: '/users/sam-wilson'}}
              />
  });

  return (
    <CardShelfWithViewport
      cellWidth={cardType === 'book' ? 'book-card' : 'image-card'}
    >
    {cardType === 'book' ? booksEl : imagesEl}
    </CardShelfWithViewport>
  );
});
