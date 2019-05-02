import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import Grid from '../Grid';
import ImageCard from '../ImageCard';

@translate()
class ImageAlbums extends Component {
  static defaultProps = {
    illustrations: []
  }

  render() {
    const { illustrations } = this.props;

    return (
      <Grid variant="4up">
        {
          illustrations.map(illustration => {
            return (
              <ImageCard
                key={illustration.id}
                title={illustration.title}
                slug={illustration.slug}
                image={illustration.imageUrls[0]}
                isCollection={illustration.count > 1}
              />
            )
          })
        }
      </Grid>
    );
  }
}

ImageAlbums.propTypes = {
  // TODO: Add shape of each object
  illustrations: PropTypes.array
};

export default ImageAlbums;
