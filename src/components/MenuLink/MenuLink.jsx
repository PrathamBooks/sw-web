import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Link from '../Link';
import Loader from '../Loader';
import SvgIcon from '../SvgIcon';

import './MenuLink.scss';

const LeftIcon = ({baseClassName, leftIcon, loading}) => {
  if (leftIcon && loading) {
    return <Loader parentClassName={`${baseClassName}__icon ${baseClassName}__icon--left` }/>
  } else if (leftIcon) {
    return <SvgIcon parentClassName={`${baseClassName}__icon ${baseClassName}__icon--left`} name={leftIcon} />
  }

  return null;
}

class MenuLink extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-menu-item';
    const {
      disabled,
      href,
      label,
      leftIcon,
      loading,
      onClick,
      rightIcon,
      theme,
      legend
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--left-icon`]: leftIcon,
      [`${baseClassName}--right-icon`]: rightIcon,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--${theme}`]: theme,
    };

    return (
      <Link
        parentClassName={classNames(classes)}
        href={href}
        onClick={onClick}
        disabled={disabled || loading}
        theme={theme}
        >
        <LeftIcon baseClassName={baseClassName} loading={loading} leftIcon={leftIcon} />
        <div className={`${baseClassName}__label`}>{label}</div>
        {
          legend
          ?
          <div className={`${baseClassName}__legend`}>{legend}</div>
          :
          null
        }
        {
          rightIcon
          ?
          <SvgIcon parentClassName={`${baseClassName}__icon ${baseClassName}__icon--right`} name={rightIcon} />
          :
          null
        }
      </Link>
    );
  }
}

MenuLink.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  loading: PropTypes.bool,
  theme: PropTypes.string,
  legend: PropTypes.string
};

export default MenuLink;
