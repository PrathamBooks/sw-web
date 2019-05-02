import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import List from '../List';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
// import { getUiConfig } from '../lib/ui.js';

import './SocialLinks.scss';

@translate()
class SocialLinks extends Component {
  static defaultProps = {
    variant: 'default',
    links: {}
  }

  render() {
    const { t } = this.props;
    const baseClassName = 'pb-social-links';
    const classNames = [baseClassName];

    if (this.props.theme) {
      classNames.push(`${baseClassName}--${this.props.theme}`);
    }

    if (this.props.variant) {
      classNames.push(`${baseClassName}--${this.props.variant}`);
    }

    const linkEls = [];
    Object.keys(this.props.links).forEach((l, i) => {
      const link = this.props.links[l];
      if (link) {
        linkEls.push(
        <Link
          key={`${i}-${link}`}
          parentClassName={`${baseClassName}__link`}
          href={link}
          shouldOpenNewPage
          title={t(`global.${l}`)}>
          <SvgIcon name={l} />
        </Link>
        )
      }
    });

    return (
      <List inline parentClassName={classNames.join(' ')}>{linkEls}</List>
    );
  }
}

SocialLinks.propTypes = {
  links: PropTypes.shape({
    facebook: PropTypes.string,
    rss: PropTypes.string,
    twitter: PropTypes.string,
    youtube: PropTypes.string,
    instagram: PropTypes.string
  }),
  theme: PropTypes.string,
  variant: PropTypes.oneOf([
    'default',
    'circular'
  ]),
  t: PropTypes.func
};

export default SocialLinks;
