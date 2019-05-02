import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Rowifier.scss';

class Rowifier extends Component {
  static defaultProps = {
    align: 'left'
  }

  render() {
    const baseClassName = 'pb-rowifier';

    const {
      children,
      align,
      separator,
      borderTop,
      borderBottom
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--align-${align}`]: align,
      [`${baseClassName}--separator`]: separator,
      [`${baseClassName}--border-top`]: borderTop,
      [`${baseClassName}--border-bottom`]: borderBottom,
    };

    return (
      <div className={classNames(classes)}>
        {
          React.Children
            .toArray(children)
            .map((child, i) => <div key={`row.${i}`} className={`${baseClassName}__row`}>{child}</div>)
        }
      </div>
    );
  }
}

Rowifier.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf([
    'left',
    'right',
    'center'
  ]),
  separator: PropTypes.bool
};

export default Rowifier;
