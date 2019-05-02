import React, { Component } from 'react'
import { connect } from 'react-redux'

import Notification from '../Notification'
import Block from '../Block'

import { dismiss } from '../../redux/notificationActions'

const mapStateToProps = state => {
  return {
    notifications: state.notification.notifications
  }
}

@connect(mapStateToProps, { dismiss })
class NotificationContainer extends Component {
  render() {
    const { notifications, dismiss } = this.props
    return (
      <Block noHorizontalPadding noVerticalPadding>
        {
          notifications.map((options, index) => {
            const defaultOptions = {
              onDismiss: dismiss.bind(this, index),
              dismissLabel: 'Dismiss'
            }
            return <Notification {...defaultOptions} {...options} />
          })
        }
      </Block>
    )
  }
}

export default NotificationContainer
