import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Overlay from '../Overlay';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
import { keyCodes } from '../../lib/constants';

import './Modal.scss';

class Modal extends Component {
  static defaultProps = {
    background: 'default'
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === keyCodes.esc && this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const baseClassName = 'pb-modal';

    const {
      children,
      footer,
      header,
      noContentPadding,
      noContentScroll,
      fillViewport,
      background,
      onClose,
      noDimensionRestrictions,
      narrow,
      wide,
      extraWide,
      overlayTheme,
      long,
      extraLong
    } = this.props

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--no-content-padding`]: noContentPadding,
      [`${baseClassName}--footer`]: footer,
      [`${baseClassName}--header`]: header,
      [`${baseClassName}--fill-viewport`]: fillViewport,
      [`${baseClassName}--no-content-scroll`]: noContentScroll,
      [`${baseClassName}--bg-${background}`]: background,
      [`${baseClassName}--no-dimension-restrictions`]: noDimensionRestrictions,
      [`${baseClassName}--long`]: long,      
      [`${baseClassName}--closable`]: onClose,
      [`${baseClassName}--narrow`]: narrow,
      [`${baseClassName}--wide`]: wide,
      [`${baseClassName}--extra-wide`]: extraWide,
      [`${baseClassName}--extra-long`]: extraLong,
    }

    return (
      <div className={classNames(classes)}>
        <Overlay theme={overlayTheme}/>
        <div className={`${baseClassName}__container`}>
          <div className={`${baseClassName}__bounds`}>
          <div className={`${baseClassName}__content-wrapper`}>
              <div className={`${baseClassName}__content`}>{children}</div>
            </div>
            {
              header
              ?
              (
                <div className={`${baseClassName}__header`}>
                  {header}
                </div>
              )
              :
              null
            }
            {
              footer
              ?
              (
                <div className={`${baseClassName}__footer`}>
                  {footer}
                </div>
              )
              :
              null
            }
            {
              onClose
              ?
              <Link parentClassName={`${baseClassName}__close`} onClick={onClose}>
                <SvgIcon name="close" />
              </Link>
              :
              null
            }
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.node,
  header: PropTypes.node,
  noContentPadding: PropTypes.bool,
  noContentScroll: PropTypes.bool,
  fillViewport: PropTypes.bool,
  noDimensionRestrictions: PropTypes.bool,
  onClose: PropTypes.func,
  /* Default background is default */
  background: PropTypes.oneOf([
    'default',
    'transparent'
  ]),
  overlayTheme: PropTypes.shape(Overlay.propTypes.theme)
};

export default Modal;
