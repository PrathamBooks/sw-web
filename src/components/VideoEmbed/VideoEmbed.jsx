import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TubeEmbed from 'react-tube-embed';

import './VideoEmbed.scss';

class VideoEmbed extends Component {
  static defaultProps = {
    aspectRatio: '4-by-3'
  }

  render() {
    const baseClassName = 'pb-video-embed';
    const classNames = [baseClassName];

    const { src, aspectRatio } = this.props;

    classNames.push(`${baseClassName}--${aspectRatio}`);

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__wrapper`}>
          <TubeEmbed src={src} />
        </div>
      </div>
    );
  }
}

VideoEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  /* Default size is 4-by-3 */
  aspectRatio: PropTypes.oneOf([
    '4-by-3',
    '1-by-1',
    '16-by-9'
  ])
};

export default VideoEmbed;
