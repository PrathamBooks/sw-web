import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '../SvgIcon';
import Link from '../Link';
import { delays } from '../../lib/constants';

import './SlimNotification.scss';

class SlimNotification extends Component {
  static defaultProps = {
    type: 'info'
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
        this.props.onDismiss();
    }, delays.slimNotificationModal);
  }

  componentWillUnmount() {
    // Clear timeout while unmounting
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  render() {
    const baseClassName = 'pb-slim-notification';
    const classNames = [baseClassName];

    const {
      type,
      content,
      onDismiss
    } = this.props;

    classNames.push(`${baseClassName}--${type}`);
    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__icon-wrapper`}>
          <SvgIcon parentClassName={`${baseClassName}__icon`} name={type} size="m" />
        </div>
        <div className={`${baseClassName}__content-wrapper`}>
          <p className={`${baseClassName}__content`}>{content}</p>
        </div>
        <div className={`${baseClassName}__actions`}>
            <Link parentClassName={`${baseClassName}__close`} onClick={onDismiss}>
              <SvgIcon name="close" />
            </Link>
        </div>
      </div>
    );
  }
}

SlimNotification.propTypes = {
  type: PropTypes.oneOf([
    'info',
    'danger',
    'success'
  ]),
  content: PropTypes.string.isRequired,
  onDismiss: PropTypes.func
};

export default SlimNotification;
