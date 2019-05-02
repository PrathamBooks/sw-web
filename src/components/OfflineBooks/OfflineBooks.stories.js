import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { imageObject } from '../Img/Img.stories.js';
import { translate } from 'react-polyglot';

import OfflineBooks from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
@translate()
class OfflineBooksWithViewport extends Component {
  render() {
    return <OfflineBooks viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('OfflineBooks', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const offline = boolean('Offline?');
  const editActive = boolean('Edit Active?');
  const numberOfBooks = number('Number of Books', 12, {
     range: true,
     min: 0,
     max: 20,
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
      ]
    };
  });

  return <OfflineBooksWithViewport
    online={!offline}
    books={books}
    editActive={editActive}/>
});
