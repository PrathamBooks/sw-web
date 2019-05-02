import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { fetchEmailConfirmationWorkflow } from '../../redux/userActions'
import { notify } from '../../redux/notificationActions'
import HomeContainer from '../../components/HomeContainer';

const mapDispatchToProps = {
  fetchEmailConfirmationWorkflow,
  notify
};

@translate()
@connect(null, mapDispatchToProps)
class EmailConfirmationContainer extends Component {
  componentDidMount() {
    const { match, t, fetchEmailConfirmationWorkflow, notify} = this.props;
    fetchEmailConfirmationWorkflow(match.params.token)
      .then(response => {
        if(response['confirmation_token'])
        {
          notify({
            title: t('global.error'),
            content: t('global.email-confirmation-error', { confirmation_token: response['confirmation_token'] })
          })
        }
        else
        {
          notify({
            title: t('global.email-confirmation')
            })
        }
    });
  }
  render() {
    return <HomeContainer />
  }
}

export default EmailConfirmationContainer;
