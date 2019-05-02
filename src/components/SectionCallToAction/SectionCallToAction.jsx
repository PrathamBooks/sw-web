import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Link from '../Link';

import './SectionCallToAction.scss';

class SectionCallToAction extends Component {
  render() {
    const baseClassName = 'pb-section-call-to-action';

    const {
      label,
      href,
      theme,
      isInternal,
      borderBottom
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--border-bottom`]: borderBottom
    };

    return (
      <div className={classNames(classes)}>
        <Link
          isInternal={isInternal}
          parentClassName={`${baseClassName}__link`}
          href={href}
          theme={theme}>
          {label}
        </Link>
      </div>
    );
  }
}

SectionCallToAction.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  theme: PropTypes.string,
  isInternal: PropTypes.bool,
  borderBottom: PropTypes.bool
};

export default SectionCallToAction;
