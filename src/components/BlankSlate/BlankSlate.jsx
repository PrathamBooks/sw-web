import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Img from '../Img';
import SvgIcon from '../SvgIcon';

import './BlankSlate.scss';

const GraphicEl = ({icon, image, url, baseClassName, title}) => {
  const altTitle = `Graphic for ${title}`;

  let graphicEl;
  if (image) {
    graphicEl = <Img image={image} alt={altTitle} />
  } else if (url) {
    graphicEl = <img src={url} alt={altTitle} />
  } else if (icon) {
    graphicEl = <SvgIcon name={icon} size="xxl" />
  } else {
    return null;
  }

  return <div className={`${baseClassName}__graphic`}>{graphicEl}</div>
};

class BlankSlate extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-blank-slate';

    const {
      title,
      children,
      icon,
      image,
      url
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <GraphicEl
          icon={icon}
          image={image}
          url={url}
          title={title}
          baseClassName={baseClassName} />
        {
          title
          ?
          <h2 className={`${baseClassName}__title`}>{title}</h2>
          :
          null
        }
        <div className={`${baseClassName}__content`}>{children}</div>
      </div>
    );
  }
}

BlankSlate.propTypes = {
  icon: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.shape(Img.propTypes.image),
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default BlankSlate;
