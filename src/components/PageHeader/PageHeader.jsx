import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Breadcrumb from '../Breadcrumb';
import SvgIcon from '../SvgIcon';
import Img from '../Img';

import './PageHeader.scss';

const baseClassName = 'pb-page-header';

class PageHeader extends Component {
  constructor(props) {
    super(props);

    this.renderBackground = this.renderBackground.bind(this);
  }

  renderBackground(image) {

    let imageEl;
    if (typeof image === 'string') {
      imageEl = <div className={`${baseClassName}__bg-img`} style={{backgroundImage: `url(${image})`}} key="1"></div>
    } else {
      imageEl = <Img parentClassName={`${baseClassName}__img`} image={image} />
    }

    if (image) {
      return [
        imageEl,
        <div className={`${baseClassName}__bg-overlay`} key="2"></div>
      ];
    }
  }

  render() {
    const {
      title,
      breadcrumbPaths,
      image,
      icon,
      actions,
      pullInBottom,
      children,
      overlayVariant
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--bg-image`]: image,
      [`${baseClassName}--icon`]: icon,
      [`${baseClassName}--pull-in-bottom`]: pullInBottom,
      [`${baseClassName}--overlay-${overlayVariant}`]: overlayVariant
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__wrapper`}>
          {
            breadcrumbPaths
            ?
            <Breadcrumb paths={breadcrumbPaths} theme={image ? 'light' : null}/>
            :
            null
          }
          {
            icon
            ?
            <SvgIcon parentClassName={`${baseClassName}__icon`} name={icon} size="xl"/>
            :
            null
          }
          <div className={`${baseClassName}__content`}>
            <h1 className={`${baseClassName}__title`}>{title}</h1>
            {children}
          </div>
          <div className={`${baseClassName}__actions`}>
            {actions}
          </div>
          {this.renderBackground(image)}
        </div>
      </div>
    );
  }
}

PageHeader.propTypes = {
  breadcrumbPaths: Breadcrumb.propTypes.paths,
  title: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  icon: PropTypes.string,
  pullInBottom: PropTypes.bool,
  children: PropTypes.node,
  actions: PropTypes.node,
  overlayVariant: PropTypes.oneOf([
    'default',
    'mid-night-gradient',
  ])
};

export default PageHeader;
