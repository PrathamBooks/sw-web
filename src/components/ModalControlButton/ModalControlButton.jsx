import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './ModalControlButton.scss';

class ModalControlButton extends Component {
  static defaultProps = {
    size: 's-m'
  }

  render() {
    const baseClassName = 'pb-modal-control-button';

    const {
      href,
      icon,
      label,
      onClick,
      size
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${size}`]: size
    };

    return (
      <Link
        parentClassName={classNames(classes)}
        title={label}
        onClick={onClick}
        href={href}>
        <SvgIcon parentClassName={`${baseClassName}__icon`} name={icon} size={size} />
      </Link>
    );
  }
}

ModalControlButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: SvgIcon.propTypes.size,
  onClick: PropTypes.func,
  href: PropTypes.string
};

export default ModalControlButton;
