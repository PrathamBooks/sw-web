import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleBlurb from '../ArticleBlurb'
import './MediaMentions.scss';

class MediaMentions extends Component {
  static defaultProps = {
    mediaMentions: []
  }
  render() {
    const mediaMentions = this.props.mediaMentions.map(mediaMention =>
      <ArticleBlurb
        key={mediaMention.id}
        title={mediaMention.title}
        date={mediaMention.date}
        meta={[mediaMention.platform]}
        summary={mediaMention.description}
        url={mediaMention.url}
      />
    );

    return (
      <div>
        {mediaMentions}
      </div>
    );
  }
}

MediaMentions.propTypes = {
  // TODO: Add shape of each object
  mediaMentions: PropTypes.array
};

export default MediaMentions;
