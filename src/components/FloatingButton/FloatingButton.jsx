import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../Link';
import SvgIcon from '../SvgIcon';
import Badge from '../Badge';

import './FloatingButton.scss';

class FloatingButton extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-floating-button';

    const {icon, onClick, count} = this.props;

    const classes = {
      [baseClassName]: true,
    };

    return (
      <Link parentClassName={classNames(classes)} onClick={onClick}>
        <div className={`${baseClassName}__wrapper`}>
          <SvgIcon
            parentClassName={`${baseClassName}__icon`}
            name={icon}
            size="m"/>
          {
            count
            ?
            <Badge parentClassName={`${baseClassName}__count`} theme="light" value={count} />
            :
            null
          }
        </div>
      </Link>
    );
  }
}

FloatingButton.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func
};

export default FloatingButton;
