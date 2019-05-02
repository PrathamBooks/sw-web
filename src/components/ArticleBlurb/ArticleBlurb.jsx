import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

import Link from '../Link';
import List from '../List';
import Img from '../Img';

import './ArticleBlurb.scss';

class ArticleBlurb extends Component {
  static defaultProps = {
    meta: []
  }

  render() {
    const baseClassName = 'pb-article-blurb';
    const classNames = [baseClassName];
    const {
      title,
      date,
      meta,
      summary,
      url,
      image
    } = this.props;

    let metaEls = [];
    if (date) {
      // TODO: Simplify this by receiving the date as a Number and not a String
      const dateString = dateFormat(new Date(parseInt(date, 10)), 'longDate');
      metaEls.push(<span key={date}>{dateString}</span>);
    }

    if (meta) {
      meta.forEach((m) => {
        metaEls.push(<span key={m}>{m}</span>);
      });
    }

    return (
      <div className={classNames.join(' ')}>
        {
          image
          ?
          <Link href={url} parentClassName={`${baseClassName}__image-link`}>
            <Img parentClassName={`${baseClassName}__image`} image={image} />
          </Link>
          :
          null
        }
        <h2 className={`${baseClassName}__title`}>
          <Link parentClassName={`${baseClassName}__link`} href={url}>{title}</Link>
        </h2>
        {
          metaEls.length > 0
          ?
          <List parentClassName={`${baseClassName}__meta-list`} inline separator="-">{metaEls}</List>
          :
          null
        }
        <div className={`${baseClassName}__summary`}>{summary}</div>
      </div>
    );
  }
}

ArticleBlurb.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  meta: PropTypes.array,
  summary: PropTypes.string.isRequired,
  url: PropTypes.string,
  image: PropTypes.shape(Img.propTypes.image)
};

export default ArticleBlurb;
