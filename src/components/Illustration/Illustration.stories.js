import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Illustration from '.';

import { imageObjectLandscape, imageObjectPortrait } from '../Img/Img.stories.js';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class IllustrationWithViewport extends Component {
  render() {
    return <Illustration viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('Illustration', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const portrait = boolean('Portrait Image?');
  const currentImage = portrait ? imageObjectPortrait : imageObjectLandscape;
  const partOfCollection = boolean('Part of collection?', true);
  const hasNext = boolean('Enable Next?');
  const hasPrevious = boolean('Enable Previous?');
  const online = boolean('Connected to Internet (online)?', true);
  const likes = number('Likes', 300);
  const liked = boolean('Current user liked?');
  const title = text('Title', 'Little Boy’s Family Safari Vacation');
  const slug = text('Slug', 'little-boy-s-family-safari-vacation');
  const artist = object('Owner', 
    [{
      name: 'Sam Wilson', 
      slug: 'sam-wilson'
    },
    {
      name: 'Jane Doe',
      slug: '/users/jane-doe'
    }]);

  const description = text('Description', 'This illustration originally appeared in the print version of ‘The Missing Bat’ by Pratham Books. The development of this book has been supported by Parag (Promoting Innovative Publishing in Education).');
  const tags = text('Tags', [
    "Animals",
    "Moral",
    "Folklores",
    "Village",
    "Wildlife"
  ]);
  const imagesInCollection = 14;
  const currentImageIndex = number('Current image index in collection', 3, {
     range: true,
     min: 0,
     max: imagesInCollection - 1,
     step: 1,
  });

  const images = Array.apply(null, {length: imagesInCollection}).map((n, i) => {
    let image = i % 2 ? imageObjectPortrait : imageObjectLandscape;
    if (i === currentImageIndex) {
      image = currentImage;
    }

    return {
      id: `image-${i}`,
      image: image,
      title: `Some sensible title ${i}`,
      slug: `image-${i}`,
      artist: {
        name: `Artist name ${i}`,
        slug: `artist-name-${i}`
      }
    };
  });

  return <IllustrationWithViewport
    title={title}
    slug={slug}
    author={artist}
    description={description}
    tags={tags}
    image={currentImage}
    index={currentImageIndex}
    collection={partOfCollection ? images : null}
    likes={likes}
    liked={liked}
    online={online}
    onClickLike={action('like-clicked')}
    onClickNext={hasNext ? action('next-clicked') : null}
    onClickPrevious={hasPrevious ? action('previous-clicked') : null}
    similarImages={images}
    />
});
