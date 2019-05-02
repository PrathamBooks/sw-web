import React, { Component } from 'react'
import { connect } from 'react-redux'

import SlimNotification from '../SlimNotification'
import Block from '../Block';

import { dismiss } from '../../redux/slimNotificationActions';
import './SlimNotificationContainer.scss';

const mapStateToProps = state => {
  return {
    notifications: state.slimNotification.notifications
  }
}

@connect(mapStateToProps, { dismiss })
class SlimNotificationContainer extends Component {
  render() {
    const { notifications, dismiss } = this.props
    const baseClassName = 'pb-slim-notification-container';
    return (
      <div className={baseClassName}>
        <Block noHorizontalPadding noVerticalPadding>
          {
            notifications.map((options, index) => {
              const defaultOptions = {
                onDismiss: dismiss.bind(this, index)
              }
              return <SlimNotification {...defaultOptions} {...options} />
            })
          }
        </Block>
      </div>
    )
  }
}

export default SlimNotificationContainer
