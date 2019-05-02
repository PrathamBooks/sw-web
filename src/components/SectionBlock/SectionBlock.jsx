import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Block from '../Block';

import './SectionBlock.scss';

class SectionBlock extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-section-block';

    const {
      children,
      title,
      noContentHorizontalPadding,
      background,
      theme,
      separateHeader
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${theme}`]: theme,
      [`${baseClassName}--no-content-horizontal-padding`]: noContentHorizontalPadding,
      [`${baseClassName}--separate-header`]: separateHeader,
    };

    return (
      <div className={classNames(classes)}>
        <Block background={theme === 'light' ? 'transparent' : background}>
          {
            title
            ?
            (
              <div className={`${baseClassName}__header`}>
                <h2 className={`${baseClassName}__title`}>{title}</h2>
              </div>
            )
            :
            null
          }
          <div className={`${baseClassName}__content`}>{children}</div>
        </Block>
      </div>
    );
  }
}

SectionBlock.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  background: Block.propTypes.background,
  noContentHorizontalPadding: PropTypes.bool,
  theme: PropTypes.string,
  separateHeader: PropTypes.bool
};

export default SectionBlock;
