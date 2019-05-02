import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import ArticleBlurb from '../ArticleBlurb';
import Block from '../Block';
import Grid from '../Grid';
import SectionCallToAction from '../SectionCallToAction';
import SvgIcon from '../SvgIcon';

import { links } from '../../lib/constants';

import './BlogPosts.scss';

const Posts = ({posts, baseClassName}) => {
  return (
    <div className={`${baseClassName}__posts`}>
      <Grid variant="2up">
        {
          posts.map(post => {
            return (
              <ArticleBlurb
                title={post.title}
                url={post.blogUrl}
                summary={post.description}
                image={post.imageUrls}
              />
            );
          })
        }
      </Grid>
    </div>
  );
};

class BlogPosts extends Component {
  static defaultProps = {
    icon: 'quill'
  }

  render() {
    const baseClassName = 'pb-blog-posts';

    const {
      t,
      title,
      icon,
      posts
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <Block>
          <div className={`${baseClassName}__header`}>
            <div className={`${baseClassName}__icon`}>
              <SvgIcon name={icon} size="xl" variant="accent" />
            </div>
            <h2 className={`${baseClassName}__title`}>{title || t("BlogPosts.title")}</h2>
          </div>
          <Posts baseClassName={baseClassName} posts={posts} />
          <SectionCallToAction label={t("BlogPosts.read-more")} href={links.blog()} />
        </Block>
      </div>
    );
  }
}

BlogPosts.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape(ArticleBlurb.propTypes)).isRequired
};

export default translate()(BlogPosts);
