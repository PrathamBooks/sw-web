import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { userAuthStages } from '../../lib/constants';
import AuthModal from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class AuthModalWithViewport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userType: 'reader',
      createNewOrg: false
    }
  }

  onUserTypeChangeHandler = (val) => {
    if (this.state.userType !== val) {
      this.setState({
        userType: val
      })
    }

    if (this.props.onUserTypeChange) {
      this.props.onUserTypeChange(val)
    }
  }

  onOrgTypeChangeClickHandler= (e) => {
    e.preventDefault();

    this.setState({
      createNewOrg: !this.state.createNewOrg
    });

    if (this.props.onOrgTypeChangeClick) {
      this.props.onOrgTypeChangeClick(e)
    }
  }

  render() {
    return <AuthModal
      viewport={this.props.viewport}
      {...this.props}
      createNewOrg={this.state.createNewOrg}
      onOrgTypeChangeClick={this.onOrgTypeChangeClickHandler}
      onUserTypeChange={this.onUserTypeChangeHandler}
      userType={this.state.userType} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('AuthModal', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const stage = select('Stage', userAuthStages, 'empty');
  const message = text('Message', '<div><h3>Reset Email Sent</h3> <p>Email with reset intruction sent to you registered email.</p></div>');
  const rememberMe = boolean('Remember Me?');
  const messageType = select('Message Type', {
    'info': 'Info',
    'danger': 'Danger',
    'success': 'Success',
    'warning': 'Warning',
  }, 'success')

  const languageOptions = Array.apply(null, {length: 10}).map((n, i) => {
    return {
      name: `Language ${i}`,
      queryValue: `language-${i}`
    };
  });

  return <AuthModalWithViewport
    onNext={action('next-clicked')}
    onClose={action('close-clicked')}
    onBackToLogin={action('back-to-login-clicked')}
    onUserTypeChange={action('user-type-changed')}
    rememberMe={rememberMe}
    onRemeberMeChange={action('remember-me-changed')}
    stage={stage}
    languageOptions={languageOptions}
    onOrgTypeChangeClick={action('on-org-type-change-clicked')}
    organistaions={[
      { name: '', queryValue: '' },
      { name: 'January', queryValue: 'jan' },
      { name: 'February', queryValue: 'feb' },
      { name: 'March', queryValue: 'mar' },
      { name: 'April', queryValue: 'apr' },
      { name: 'May', queryValue: 'may' },
      { name: 'June', queryValue: 'jun' },
      { name: 'July', queryValue: 'jul' },
      { name: 'August', queryValue: 'aug' }
    ]}
    message={(stage === userAuthStages.onlyMessage) ? <div dangerouslySetInnerHTML={{__html: message}}></div> : null}
    messageType={messageType}
    />
});
