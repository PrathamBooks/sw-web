import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number } from '@storybook/addon-knobs';

import Search from '.';
import { imageObject } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class SearchWithViewport extends Component {
  render() {
    return <Search viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('Search', module);
stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const numberOfItems = number('Number of items', 12, {
     range: true,
     min: 1,
     max: 25,
     step: 1,
  });

  const books = Array.apply(null, {length: numberOfItems}).map((n, i) => {
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

  const profiles = Array.apply(null, {length: numberOfItems}).map((n, i) => {
    return {
      title: `Pratham Verma ${i}`,
      slug: `pratham-${i}`,
      profileImage: 'http://via.placeholder.com/512x512?text=1:1',
      description: 'Pratham is one of the largest non-governmental organisations in India. Pratham Books was set up as a not-for-profit children’s book publisher in 2004 with the mission to see “a book in every child’s hand“.',
      type: 'USER'
    };
  });

  return <SearchWithViewport books={books} profiles={profiles}/>
});
