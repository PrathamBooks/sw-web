import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmailValid, isLengthValid, isPresent, isEqual, isNumber, isGreaterThan, createErrorMessage} from '../../lib/validations';
import { userAuthStages, countries, links } from '../../lib/constants';
import { translate } from 'react-polyglot';
import AuthModal from '../AuthModal';
import { applyFilter } from "../../redux/allFiltersActions";
import { replace } from 'react-router-redux';
import queryString from 'query-string';

import { concat } from 'lodash';

import {
  openAuthModal,
  closeAuthModal,
  fetchEmailStatusWorkflow,
  fetchLoginWorkflow,
  fetchLanguageOptionsWorkflow,
  searchOrganisationsWorkflow,
  fetchSignupWorkflow,
  fetchMeWorkflow,
  fetchForgotPasswordWorkflow,
  fetchResetPasswordWorkflow,
  fetchGoogleAuthWorkflow,
  fetchFacebookAuthWorkflow,
  fetchResendConfirmationLinkWorkflow
} from '../../redux/userActions'

import { fetchRecommendationsWorkflow } from '../../redux/homeActions';
import { notify } from '../../redux/slimNotificationActions'

const mapStateToProps = ({ viewport, user, allFilters }) => ({
  viewport,
  isAuthModalVisible: user.isAuthModalVisible,
  isLoadingNext: user.isLoadingNext,
  languageOptions: user.languageOptions,
  organisations: user.organisations,
  resetPasswordToken: user.resetPasswordToken,
  appliedFilters: allFilters[allFilters.filterType],
  filterType: allFilters.filterType
})

const mapDispatchToProps = {
  openAuthModal,
  closeAuthModal,
  fetchEmailStatusWorkflow,
  fetchLoginWorkflow,
  fetchLanguageOptionsWorkflow,
  searchOrganisationsWorkflow,
  fetchSignupWorkflow,
  fetchForgotPasswordWorkflow,
  notify,
  fetchMeWorkflow,
  fetchResetPasswordWorkflow,
  fetchFacebookAuthWorkflow,
  fetchGoogleAuthWorkflow,
  fetchRecommendationsWorkflow,
  fetchResendConfirmationLinkWorkflow,
  applyFilter,
  replace
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class AuthModalContainer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      // Default to empty but respect a passed in stage like for set password
      stage: props.stage || userAuthStages.empty,
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      languages: [],
      userType: 'reader',
      createNewOrg: false,
      organisation: '',
      country: '',
      classrooms: '',
      children: '',
      languagesSearchValue: '',
      rememberMe: false,
      countrySearchValue: ''
    }
    this.onNext = this.onNext.bind(this)
    this.close = this.close.bind(this)
    this.onChangeLanguages = this.onChangeLanguages.bind(this)
    this.onForgotPassword = this.onForgotPassword.bind(this)
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this)
    this.onFacebookSignIn = this.onFacebookSignIn.bind(this)
    this.setUserPreferences = this.setUserPreferences.bind(this)
  }

  componentWillReceiveProps({ stage }) {
    if (stage) {
      this.setState({
        stage
      })
    }
  }

  onChange(key, event) {
    this.setState({
      [key]: event.target.value
    })
  }

  onChangeLanguages(language, checked) {
    const { languages } = this.state
    let newLanguages
    if (checked) {
      newLanguages = [ language, ...languages ]
    } else {
      newLanguages = languages.filter(l => l !== language)
    }
    this.setState({ languages : newLanguages })
  }

  onOrganisationChange = (organisation, organisationSelected) => {
    this.setState({ 
      organisation,
      country: organisationSelected.country,
      classrooms: organisationSelected.classrooms,
      children: organisationSelected.children })
  }

  resetState() {
    this.setState({
      stage: userAuthStages.empty,
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      languages: [],
      userType: 'reader',
      createNewOrg: false,
      organisation: '',
      country: '',
      classrooms: '',
      children: '',
      languagesSearchValue: '',
      rememberMe: false,
      countrySearchValue: ''
    })
  }

  close() {
    this.resetState()
    this.props.closeAuthModal()
  }
  
  setUserPreferences( response ) {

    // if login not from read page don't apply user preferences to filters
    if ( window.location.pathname !== links.allBooksPath()) return;

    // if user not logged in don't apply any preferences to filters
    if ( !response.data.isLoggedIn ) return;
    
    const {
      applyFilter,
      filterType,
      appliedFilters,
      replace
    } = this.props;
    
    // Check if any filters are selected by user, if selected do not modify filters
    const filterWithNoSort = { ...appliedFilters, ...{ sort: [] } };
    let setUserPreferences = !Array.isArray(Object.values(filterWithNoSort).find(( value ) => ( value.length !== 0 )));
    if (!setUserPreferences) return;
      
    // Apply user preferences to filters
    const updatedField = {};
    const { languagePreferences, readingLevels } = response.data;
    
    if ( languagePreferences.length > 0 || readingLevels.length > 0 ) {
      updatedField['language'] = languagePreferences;
      updatedField['level'] = readingLevels;
      
      applyFilter({ filterType: filterType, filter: updatedField });
      replace({ search:  queryString.stringify({ ...appliedFilters, ...updatedField }) });
    }
  }

  onNext() {
    const {
      t,
      fetchEmailStatusWorkflow,
      fetchLoginWorkflow,
      fetchLanguageOptionsWorkflow,
      fetchSignupWorkflow,
      fetchMeWorkflow,
      fetchResetPasswordWorkflow,
      resetPasswordToken,
      notify,
      fetchRecommendationsWorkflow,
      fetchResendConfirmationLinkWorkflow
    } = this.props
    
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      createNewOrg,
      organisation,
      country,
      classrooms,
      children,
      stage,
      languages,
      rememberMe,
      userType
    } = this.state

    // Login flow
    if (stage === userAuthStages.empty) {
      return fetchEmailStatusWorkflow(email)
        .then(response => {
          const nextStage = response.data.exists
           ? userAuthStages.password
           : userAuthStages.userInfo
          
          this.setState({
            stage: nextStage
          })
        })
    }

    if (stage === userAuthStages.password) {
      return fetchLoginWorkflow(email, password, rememberMe)
        .then(response => {
          const errorMessage = response.error
          if(errorMessage)
          { 
            notify({
              title: t('AuthModalContainer.login-error'),
              content: errorMessage
            })
            
          }
          else
          {
            notify({
              type: 'success',
              content: t('AuthModalContainer.login-successful')
              })
            this.close();
          }
        })
        .then((response) => fetchMeWorkflow(response).then(this.setUserPreferences))
        .then(fetchRecommendationsWorkflow)
    }

    // Signup flow
    if (this.state.stage === userAuthStages.userInfo) {
      return fetchLanguageOptionsWorkflow()
        .then(response => {
          const nextStage = userAuthStages.language
          this.setState({
            stage: nextStage
          })          
        })
    }

    if (this.state.stage === userAuthStages.language) {
      const nextStage = userAuthStages.userPreferences
      return this.setState({
        stage: nextStage
      })
    }

    if (this.state.stage === userAuthStages.userPreferences) {
      let details
      // Logic for whether user is part of an organisation or not 
      if (createNewOrg) {
        details = {
          'user[first_name]': firstName,
          'user[last_name]': lastName,
          'user[email]': email,
          'user[password]': password,
          'user[language_preferences': '',
          'user[password_confirmation]': confirmPassword,
          'user[organization_attributes][organization_name]': organisation,
          'user[organization_attributes][organization_type]': '',
          'user[organization_attributes][country]': country,
          'user[organization_attributes][city]': '',
          'user[organization_attributes][number_of_classrooms]': classrooms,
          'user[organization_attributes][children_impacted]': children,
          'user_opinion' : true
        }
      } else {
        details = {
          'user[first_name]': firstName,
          'user[last_name]': lastName,
          'user[email]': email,
          'user[password]': password,
          'user[language_preferences': languages.join(', '),
          'user[password_confirmation]': confirmPassword,
          'user[organization_attributes][organization_name]': organisation,
          'user[organization_attributes][country]': country,
          'user[organization_attributes][number_of_classrooms]': classrooms,
          'user[organization_attributes][children_impacted]': children,
          'user_opinion' : (userType === 'volunteer')
        }
      }
      
      return fetchSignupWorkflow(details)
        .then(response => {
          const message = response.message
          if(message)
          {
            notify({
              title: t('AuthModalContainer.signup-successful'),
              content: message
            })
            this.close();
          }
          else
          {
            notify({
              title: t('AuthModalContainer.signup-error'),
              content: response.join(', ')
            })
          }
        })
    }

    // Reset password flow
    if (this.state.stage === userAuthStages.newPassword) {
      return fetchResetPasswordWorkflow(password, confirmPassword, resetPasswordToken)
        .then(response => {
          if(response.errors)
          {
            notify({
              title: t('AuthModalContainer.password-reset-error-title'),
              content: createErrorMessage(response.errors),
            })
            this.close()
          }
          else
          {
            notify({
              title: t('AuthModalContainer.password-reset-successful')
            })
            this.close()
          }
        })
    }
    // resend confirmation flow
    if (this.state.stage === userAuthStages.resendConfirmationMail) {
      return fetchResendConfirmationLinkWorkflow(email)
        .then(response => {
          const errors = response.errors
          if(errors)
          {
            notify({
              title:  t('global.error'),
              content: createErrorMessage(errors)
            })
          }
          else
          {
            notify({
              title: t('global.success'),
              content:  t('AuthModalContainer.resend-confirmation')
            })
            this.close()
          }
        })
    }
  }

  onBack = () => {
    const {
      stage
    } = this.state

    //Login flow
    if (stage === userAuthStages.password) {    
      this.setState({
        stage: userAuthStages.empty
      })
    }

    // Signup flow
    if (this.state.stage === userAuthStages.userInfo) {
      this.setState({
        stage: userAuthStages.empty
      })
    }

    if (this.state.stage === userAuthStages.language) {
      this.setState({
        stage: userAuthStages.userInfo
      })
    }

    if (this.state.stage === userAuthStages.userPreferences) {
      this.setState({
        stage: userAuthStages.language
      })
    }

    // Reset password flow
    if (this.state.stage === userAuthStages.newPassword) {
      this.setState({
        stage: userAuthStages.empty
      })
    }

    // Resend Confirmation Mail flow
    if (this.state.stage === userAuthStages.resendConfirmationMail) {
      this.setState({
        stage: userAuthStages.empty
      })
    }
  }

  onForgotPassword() {
    const { fetchForgotPasswordWorkflow, notify } = this.props
    const { email } = this.state

    fetchForgotPasswordWorkflow(email)
      .then(response => {
        notify({
          title: 'Reset your password',
          content: `We have sent a password reset link to ${email}`
        })
        this.close()
      })
  }

  onGoogleSignIn({ profileObj: { email, name }, tokenObj: { access_token } }) {
    const { fetchGoogleAuthWorkflow, fetchMeWorkflow } = this.props
    fetchGoogleAuthWorkflow(name, email, access_token)
      .then((response) => fetchMeWorkflow(response).then(this.setUserPreferences))
      .then(response => this.close())
  }

  onFacebookSignIn({ accessToken, email, name }) {
    const { fetchFacebookAuthWorkflow, fetchMeWorkflow } = this.props
    fetchFacebookAuthWorkflow(name, email, accessToken)
      .then((response) => fetchMeWorkflow(response).then(this.setUserPreferences))
      .then(response => this.close())
  }

  onClickResendConfirmation = () => {
    this.setState({
      stage: userAuthStages.resendConfirmationMail
    })
  }
  
  render() {
    const {
      t,
      viewport,
      isAuthModalVisible,
      isLoadingNext,
      languageOptions,
      organisations,
      searchOrganisationsWorkflow,
    } = this.props
    const {
      stage,
      languagesSearchValue,
      languages,
      userType,
      createNewOrg,
      organisation,
      rememberMe,
      email,
      password,
      firstName,
      lastName,
      confirmPassword,
      classrooms,
      children,
      country
    } = this.state

    if (!isAuthModalVisible) {
      return null
    }


    let nextStageEnabled

    let validationErrors = {}
    
    if (stage === userAuthStages.empty) {
      validationErrors["email"] = concat(isEmailValid(email, t), isPresent( email, t))
      nextStageEnabled = validationErrors["email"].length === 0
    } else if (stage === userAuthStages.password) {
      validationErrors["password"] = concat(isLengthValid(password, 8, 128, t), isPresent(password, t))
      nextStageEnabled = validationErrors["password"].length === 0
    } else if (stage === userAuthStages.userInfo) {
      validationErrors["firstName"] = concat(isLengthValid(firstName, 2, 255, t), isPresent(firstName, t))
      validationErrors["lastName"] = concat(isPresent(lastName, t))
      validationErrors["password"] = concat(isLengthValid(password, 8, 128, t), isPresent(password, t))
      validationErrors["confirmPassword"] = concat(isLengthValid(confirmPassword, 8, 128, t), isPresent(confirmPassword, t), isEqual(t("global.password", 1), password, t("global.confirm-password", 1), confirmPassword, t))
      nextStageEnabled = validationErrors["firstName"].length === 0 && validationErrors["lastName"].length === 0 && validationErrors["password"].length === 0 && validationErrors["confirmPassword"].length === 0
    } else if (stage === userAuthStages.language) {
      nextStageEnabled = true
    } else if (stage === userAuthStages.userPreferences) {
      if (userType === 'reader') {
        nextStageEnabled = true
      } else if (userType === 'volunteer') {
        validationErrors["organisation"] = concat(isPresent(organisation, t))
        if (createNewOrg) {
          validationErrors["classrooms"] = concat(isPresent(classrooms, t), isNumber(classrooms, t), isGreaterThan(classrooms, 0, t))
          validationErrors["children"] = concat(isPresent(children, t), isNumber(children, t), isGreaterThan(children, 0, t))
          validationErrors["country"] = concat(isPresent(country, t))
          nextStageEnabled = validationErrors["organisation"].length === 0 && validationErrors["country"].length === 0 && validationErrors["children"].length === 0 && validationErrors["classrooms"].length === 0
        } else {
          nextStageEnabled = validationErrors["organisation"].length === 0
        }        
      }
    } else if (stage === userAuthStages.newPassword) {
      validationErrors["password"] = concat(isLengthValid(password, 8, 128, t), isPresent(password, t))
      validationErrors["confirmPassword"] = concat(isLengthValid(confirmPassword, 8, 128, t), isPresent(confirmPassword, t), isEqual(t("global.password", 1), password, t("global.confirm-password", 1), confirmPassword, t))
      nextStageEnabled = validationErrors["password"].length === 0 && validationErrors["confirmPassword"].length === 0
    } else if (stage === userAuthStages.resendConfirmationMail) {
      validationErrors["email"] = concat(isEmailValid(email, t), isPresent( email, t))
      nextStageEnabled = validationErrors["email"].length === 0
    }


    let backStageEnabled = false

    if (stage === userAuthStages.password || stage === userAuthStages.userInfo || stage === userAuthStages.language || stage === userAuthStages.userPreferences || stage === userAuthStages.newPassword || stage === userAuthStages.resendConfirmationMail) {
      backStageEnabled = true
    }

    return (
      <AuthModal
        stage={stage}
        userType={userType}
        onBack={this.onBack}
        onNext={this.onNext}
        email={email}
        firstName={firstName}
        lastName={lastName}
        viewport={viewport}
        onClose={this.close}
        isLoadingNext={isLoadingNext}
        onChangeEmail={this.onChange.bind(this, 'email')}
        languageOptions={languageOptions}
        onChangePassword={this.onChange.bind(this, 'password')}
        onChangeFirstName={this.onChange.bind(this, 'firstName')}
        onChangeLastName={this.onChange.bind(this, 'lastName')}
        onChangeChildren={this.onChange.bind(this, 'children')}
        onChangeClassrooms={this.onChange.bind(this, 'classrooms')}
        onChangeConfirmPassword={this.onChange.bind(this, 'confirmPassword')}
        onChangeLanguages={this.onChangeLanguages}
        onChangeLanguagesSearchValue={this.onChange.bind(this, 'languagesSearchValue')}
        languagesSearchValue={languagesSearchValue}
        languagesValues={languages}
        onUserTypeChange={userType => this.setState({ userType })}
        createNewOrg={createNewOrg}
        onOrgTypeChangeClick={() => this.setState({ createNewOrg: !createNewOrg, organisation: '', country: '', classrooms: '', children: ''})}
        organisations={organisations}
        onOrganisationSearchChange={searchOrganisationsWorkflow}
        onOrganisationChange={this.onOrganisationChange}
        onOrganisationNameChange={this.onChange.bind(this, 'organisation')}
        organisation={organisation}
        onForgotPassword={this.onForgotPassword}
        onGoogleSignIn={this.onGoogleSignIn}
        onFacebookSignIn={this.onFacebookSignIn}
        rememberMe={rememberMe}
        onRemeberMeChange={rememberMe => this.setState({ rememberMe: rememberMe.checked })}
        nextStageEnabled={nextStageEnabled}
        backStageEnabled={backStageEnabled}
        onChangeCountry={country => this.setState({ country })}
        countries={countries}
        country={country}
        children={children}
        classrooms={classrooms}
        onCountrySearchChange={countrySearchValue  => this.setState({ countrySearchValue })}
        validationErrors={validationErrors}
        onClickResendConfirmation={this.onClickResendConfirmation}
      />
    )
  }
}

export default AuthModalContainer
