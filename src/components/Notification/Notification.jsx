import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '../SvgIcon';
import Button from '../Button';

import './Notification.scss';

class Notification extends Component {
  static defaultProps = {
    type: 'info',
    additionalActions: []
  }

  render() {
    const baseClassName = 'pb-notification';
    const classNames = [baseClassName];

    const {
      type,
      iconName,
      title,
      content,
      onDismiss,
      dismissLabel,
      onConfirm,
      confirmLabel,
      additionalActions,
    } = this.props;

    const additionalActionEls = additionalActions.map(action => {
      return (
        <Button
          fullWidth={true}
          label={action.label}
          variant={action.primary ? 'primary' : null}
          onClick={action.onClick}
        />
      );
    });

    classNames.push(`${baseClassName}--${type}`);
    return (
      <div className={classNames.join(' ')}>
        {
          iconName
          ?
          (
            <div className={`${baseClassName}__col1`}>
              <SvgIcon parentClassName={`${baseClassName}__icon`} name={iconName} size="l" />
            </div>
          )
          :
          null
        }
        <div className={`${baseClassName}__col2`}>
          <h3 className={`${baseClassName}__title`}>{title}</h3>
          <p className={`${baseClassName}__content`}>{content}</p>
        </div>
        <div className={`${baseClassName}__col3`}>
          {additionalActionEls}
          {
            confirmLabel
            ?
            (
              <Button
                fullWidth={true}
                label={confirmLabel}
                onClick={onConfirm}
                variant={type}
              />
            )
            :
            null
          }

          {
            dismissLabel
            ?
            (
              <Button
                fullWidth={true}
                label={dismissLabel}
                onClick={onDismiss}
              />
            )
            :
            null
          }
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  type: PropTypes.oneOf([
    'info',
    'warning',
    'danger',
    'success'
  ]),
  iconName: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
  dismissLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmLabel: PropTypes.string
};

export default Notification;
