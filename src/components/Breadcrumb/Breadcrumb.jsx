import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import classNames from 'classnames';

import './Breadcrumb.scss';

class Breadcrumb extends Component {
  static defaultProps = {
    paths: []
  }

  render() {
    const baseClassName = 'pb-breadrumb';
    const {
      parentClassName,
      theme
    } = this.props;

    const links = this.props.paths.map(
      (crumb, i) => <Link isInternal={crumb.isInternal} parentClassName={`${baseClassName}__link`} href={crumb.href} key={`${i}-${crumb.href}`}>{crumb.title}</Link>
    );

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--${theme}`]: theme
    }

    return (
      <div className={classNames(classes)}>{links}</div>
    );
  }
}

Breadcrumb.propTypes = {
  parentClassName: PropTypes.string,
  paths: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string
  })),
  theme: PropTypes.string
};

export default Breadcrumb;
