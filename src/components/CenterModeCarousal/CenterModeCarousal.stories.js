import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import CenterModeCarousal from '.';
import { imageObject } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class CenterModeCarousalWithViewport extends Component {
  render() {
    return <CenterModeCarousal viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('CenterModeCarousal', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
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
      description: `The Elephant in the Room The Elephant in the Room -${i}`,
      authors: [
        {name: 'Sam Wilson', slug: '/users/sam-wilson'}
      ]
    };
  });

  const similarBooks = {similarBooks: books}

  return <CenterModeCarousalWithViewport book={similarBooks} />
});
