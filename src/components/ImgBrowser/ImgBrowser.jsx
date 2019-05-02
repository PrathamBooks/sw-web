import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import Img from '../Img';
import ImgCanvas from '../ImgCanvas';
import Link from '../Link';
import Menu from '../Menu';
import SvgIcon from '../SvgIcon';

import {getSmallestImage} from '../../lib/images';

import './ImgBrowser.scss';

const DropdownEl = ({baseClassName, menu}) => {
  if (menu) {
    const menuLinkEl = <Link
                          parentClassName={`${baseClassName}__dropdown-link`}
                          theme="dark"
                          >
                            <SvgIcon name="dots" />
                          </Link>;

    return (
      <Dropdown
        parentClassName={`${baseClassName}__dropdown`}
        toggleEl={menuLinkEl}
        noPadding
        >
        {menu}
      </Dropdown>
    );
  }

  return null;
};

class ImgBrowser extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-img-browser';
    const {
      image,
      onClickNext,
      onClickPrevious,
      menu
    } = this.props;

    let isLandscape = true;
    if (image && image.sizes) {
      const smallestImage = getSmallestImage(image.sizes);
      isLandscape = smallestImage.width > smallestImage.height;
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--image-landscape`]: isLandscape,
      [`${baseClassName}--image-portrait`]: !isLandscape
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__image-wrapper`}>
          <ImgCanvas image={image} fit="height" />
          {
            onClickPrevious || onClickNext
            ?
            [
              <Link
                parentClassName={`${baseClassName}__link ${baseClassName}__link--previous`}
                onClick={onClickPrevious}
                disabled={!onClickPrevious}
                theme="dark"
                key="1"
                >
                  <SvgIcon name="chevron-left" />
              </Link>,
              <Link
                parentClassName={`${baseClassName}__link ${baseClassName}__link--next`}
                onClick={onClickNext}
                disabled={!onClickNext}
                theme="dark"
                key="2"
                >
                  <SvgIcon name="chevron-right" />
              </Link>
            ]
            :
            null
          }
          <DropdownEl baseClassName={baseClassName} menu={menu} />
        </div>
      </div>
    );
  }
}

ImgBrowser.propTypes = {
  image: PropTypes.shape(Img.propTypes).isRequired,
  onClickNext: PropTypes.func,
  onClickPrevious: PropTypes.func,
  menu: (props, propName, componentName) => {
    const prop = props[propName];
    const areAllPropsSections = React.Children
      .toArray(prop)
      .reduce((acc, child) => acc && child.type === Menu, true);

    if (!areAllPropsSections) {
      throw new Error(`Prop 'menu' should be of instance of Menu.`);
    }
  },
};

export default ImgBrowser;
