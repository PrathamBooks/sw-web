import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import Img from '../Img';
import { imageSrcsetSizes, links } from '../../lib/constants';

import './ImageCard.scss';

class ImageCard extends Component {
  static defaultProps = {}

  render() {
    const {
      title,
      subTitle,
      slug,
      image,
      isCollection,
      artists,
      onProfileLinkClicked,
      hasOverlay
    } = this.props;

    const baseClassName = 'pb-image-card';
    const classNames = [baseClassName];

    const imagePath = process.env.REACT_APP_FEATURE_ILLUSTRATIONS ? links.illustration(slug) : links.illustrationV0(slug);

    if (isCollection) {
      classNames.push(`${baseClassName}--collection`)
    }

    let artistsEl = null;
    if (artists) {
      artistsEl = 
        artists.map(
          a => (
            <Link parentClassName={`${baseClassName}__link ${baseClassName}__artist`} isInternal href={links.userProfile(a.slug)} onClick={() => {onProfileLinkClicked(a.slug)}}>
              { a.name }
            </Link>
          )
      );
    }

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__frame-1`}>
          <div className={`${baseClassName}__frame-2`}>
            <a className={`${baseClassName}__frame`} href={imagePath}>
              <div className={`${baseClassName}__image-wrapper`}>
                <div className={`${baseClassName}__image`}>
                  { hasOverlay && <div className={`${baseClassName}__image-overlay`}></div> }
                  <Img parentClassName={`${baseClassName}__img`} image={image} alt={title} lazyLoad sizes={imageSrcsetSizes.grid4up}/>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className={`${baseClassName}__meta`}>
          <h3 className={`${baseClassName}__title`}>
            <Link parentClassName={`${baseClassName}__link`} href={imagePath}>{title}</Link>
          </h3>
          { subTitle ? <p>{subTitle}</p> : null }
          { artistsEl ? <p>{ artistsEl }</p> : null }
        </div>
      </div>
    );
  }
}

ImageCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  slug: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  isCollection: PropTypes.bool,
  artists: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  }))
};

export default ImageCard;
