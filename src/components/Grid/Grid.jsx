import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { getUiConfig } from '../lib/ui.js';

import './Grid.scss';
const baseClassName = 'pb-grid';

class Grid extends Component {
  static defaultProps = {
    variant: '1up'
  }

  render() {
    const { children } = this.props;
    const classNames = [baseClassName];
    const itemEls = [];

    if (this.props.variant) {
      classNames.push(`${baseClassName}--${this.props.variant}`);
    }

    if (children && children.length && (typeof children !== 'string')) {
      React.Children.forEach(children, (c, i) => {
        itemEls.push(<div className={`${baseClassName}__item`} key={i}>{c}</div>);
      });
    } else {
      itemEls.push(<div className={`${baseClassName}__item`} key="1">{children}</div>);
    }

    return (
      <div className={classNames.join(' ')}>
        <div className="grid__container">{itemEls}</div>
      </div>
    );
  }
}

Grid.propTypes = {
  /* Default size is 1up */
  variant: PropTypes.oneOf([
    '1up',
    '2up',
    '3up',
    '4up',
    '6up',
    '2up-6up'
  ]),
  children: PropTypes.node
};

export default Grid;
