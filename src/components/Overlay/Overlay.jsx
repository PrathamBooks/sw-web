import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { disableDocumentScroll, enableDocumentScroll } from '../../lib/documentScroll.js';

import './Overlay.scss';

class Overlay extends Component {
  static defaultProps = {
    theme: 'dark'
  }

  componentDidMount() {
    disableDocumentScroll();
  }

  componentWillUnmount() {
    enableDocumentScroll();
  }

  render() {
    const baseClassName = 'pb-overlay';

    const {
      onClick,
      theme
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${theme}`]: theme
    };

    return (
      <div className={classNames(classes)} onClick={onClick}></div>
    );
  }
}

Overlay.propTypes = {
  onClick: PropTypes.func,
  theme: PropTypes.oneOf([
    'dark',
    'light'
  ]),
};

export default Overlay;
