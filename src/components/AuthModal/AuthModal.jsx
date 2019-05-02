import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import Alert from '../Alert';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Columnizer from '../Columnizer';
import Halver from '../Halver';
import Hr from '../Hr';
import Link from '../Link';
import Modal from '../Modal';
import Picklist from '../Picklist';
import RadioGroup from '../RadioGroup';
import SearchableSelectField from '../SearchableSelectField';
import SvgIcon from '../SvgIcon';
import TextField from '../TextField';
import { createErrorMessage } from '../../lib/validations';

import { userAuthStages, keyCodes } from '../../lib/constants';

import './AuthModal.scss';

const EmailTextFieldEl = ({baseClassName, t, stage, onChange, email, validationErrors}) => {
  if (stage === userAuthStages.empty || stage === userAuthStages.resetPassword || stage === userAuthStages.resendConfirmationMail) {
    return (
      <TextField
        error={validationErrors['email'].length > 0 ? validationErrors['email'].join(", ") : null}
        id="auth-modal-email"
        parentClassName={`${baseClassName}__text-field`}
        label={t("global.email", 1)}
        name="email"
        onChange={onChange}
        autoFocus
        value={email}
      />
    )
  }

  return null;
};

const PasswordTextFieldEl = ({baseClassName, t, stage, onChange, validationErrors}) => {
  if ((stage === userAuthStages.password) ||
      (stage === userAuthStages.userInfo) ||
      (stage === userAuthStages.newPassword)) {
    return <TextField
              error={createErrorMessage(validationErrors['password'])}
              id="auth-modal-password"
              parentClassName={`${baseClassName}__text-field ${stage === userAuthStages.empty ? `${baseClassName}__text-field--hide` : ''}`}
              label={t("global.password", 1)}
              name="password"
              type="password"
              onChange={onChange}
              autoFocus={(stage === userAuthStages.password) ||(stage === userAuthStages.newPassword)}
              />
  }

  return null;
}

const ConfirmPasswordTextFieldEl = ({baseClassName, t, stage, onChange, validationErrors}) => {
  if ((stage === userAuthStages.userInfo) ||
    (stage === userAuthStages.newPassword)) {
    return <TextField
              error={createErrorMessage(validationErrors['confirmPassword'])}
              id="auth-modal-confirm-password"
              parentClassName={`${baseClassName}__text-field}`}
              label={t("global.confirm-password", 1)}
              name="confirm-password"
              type="password"
              onChange={onChange}
              />
  }

  return null;
}

const FirstNameTextFieldEl = ({baseClassName, t, stage, onChange, firstName, validationErrors}) => {
  if (stage === userAuthStages.userInfo) {
    return <TextField
              error={createErrorMessage(validationErrors['firstName'])}
              id="auth-modal-first-name"
              parentClassName={`${baseClassName}__text-field}`}
              label={t("AuthModal.label-first-name", 1)}
              name="first-name"
              value={firstName}
              onChange={onChange}
              autoFocus
              />
  }

  return null;
}

const LastNameTextFieldEl = ({baseClassName, t, stage, onChange, lastName, validationErrors}) => {
  if (stage === userAuthStages.userInfo) {
    return <TextField
              error={createErrorMessage(validationErrors['lastName'])}
              id="auth-modal-last-name"
              parentClassName={`${baseClassName}__text-field}`}
              label={t("AuthModal.label-last-name", 1)}
              name="last-name"
              value={lastName}
              onChange={onChange}
              />
  }

  return null;
}

const UserTypeRadioGroupEl = ({baseClassName, t, stage, userType, onUserTypeChange}) => {
  if(stage === userAuthStages.userPreferences) {
    return <RadioGroup
              id="auth-modal-user-type"
              radios={[
                { label: t("AuthModal.label-reader"), value: 'reader' },
                { label: t("AuthModal.label-work-with-children"), value: 'volunteer' },
              ]}
              defaultValue={userType}
              onChange={onUserTypeChange}
              name="auth-modal-user-type"
              autoFocus
              />
  }

  return null;
}

const OrganisationDetailsEl = ({
  baseClassName,
  t,
  stage,
  userType,
  onOrgTypeChangeClick,
  createNewOrg,
  organisations,
  onOrganisationSearchChange,
  onChange,
  onOrganisationNameChange,
  organisation,
  onChangeClassrooms,
  onChangeCountry,
  onChangeChildren,
  countries,
  country,
  children,
  classrooms,
  validationErrors,
  onCountrySearchChange
}) => {
  if (stage === userAuthStages.userPreferences && userType === 'volunteer') {
    return (
      <div>
        {
          createNewOrg
          ?
          <TextField
            error={createErrorMessage(validationErrors['organisation'])}
            id="auth-modal-new-organisation"
            parentClassName={`${baseClassName}__text-field}`}
            label={t("AuthModal.label-organisation-name", 1)}
            name="organisation"
            value={organisation}
            autoFocus
            onChange={onOrganisationNameChange}
            />
          :
          <SearchableSelectField
            error={createErrorMessage(validationErrors['organisation'])}
            id="auth-modal-organisation"
            label={t("AuthModal.label-pick-organisation", 1)}
            parentClassName={`${baseClassName}__text-field}`}
            name="auth-modal-organisation"
            options={organisations}
            onSearchChange={onOrganisationSearchChange}
            onChange={onChange}
            height="s"
            value={organisation}
            autoFocus
            />
        }
        <div className={`${baseClassName}__link ${baseClassName}__link--align-right`}>
          <Link
            onClick={onOrgTypeChangeClick}>
              {createNewOrg ? t("AuthModal.label-pick-existing-organisation") : t("AuthModal.label-add-new-organisation")}
          </Link>
        </div>
        {
          createNewOrg
          ?
          <div>
            <SearchableSelectField
              error={createErrorMessage(validationErrors['country'])}
              id="auth-modal-place"
              label={t("AuthModal.label-place", 1)}
              parentClassName={`${baseClassName}__text-field}`}
              name="place"
              onChange={onChangeCountry}
              options={countries}
              onSearchChange={onCountrySearchChange}
              value={country}
              height="s"
              autoFocus
            />

            <TextField
              error={createErrorMessage(validationErrors['classrooms'])}
              id="auth-modal-classrooms"
              parentClassName={`${baseClassName}__text-field}`}
              label={t("AuthModal.label-classrooms", 1)}
              name="classrooms"
              onChange={onChangeClassrooms}
              type="tel"
              min="0"
              value={classrooms}
            />
            <TextField
              error={createErrorMessage(validationErrors['children'])}
              id="auth-modal-children"
              parentClassName={`${baseClassName}__text-field}`}
              label={t("AuthModal.label-children", 1)}
              name="children"
              onChange={onChangeChildren}
              type="tel"
              min="0"
              value={children}
            />
          </div>
          :
          null
        }
      </div>
    );
  }

  return null;
}

const ForgoPasswordLinkEl = ({baseClassName, t, stage, onForgotPassword}) => {
  if(stage === userAuthStages.password) {
    return <div className={`${baseClassName}__link ${baseClassName}__link--align-right`}><Link onClick={onForgotPassword}>{t("AuthModal.label-forgot-password")}</Link></div>;
  }

  return null;
}

const LanguagePicklistEl = ({baseClassName, t, stage, onForgotPassword, languageOptions, onChange, onSearchChange, searchValue, checkedValues}) => {
  if(stage === userAuthStages.language) {
    return <Picklist
            id="auth-modal-language"
            options={languageOptions}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onChange={onChange}
            checkedValues={checkedValues}
            autoFocus
            />;
  }

  return null;
}

const SocialSignInEls = ({baseClassName, t, stage, onGoogleSignIn, onFacebookSignIn}) => {
  if (stage === userAuthStages.empty) {
    return (
      <div className={`${baseClassName}__section`}>
        <Hr />
        <h3 className={`${baseClassName}__section-title`}>{t("AuthModal.section-title-empty")}</h3>
        <Columnizer>
          <FacebookLogin
            size={null}
            cssClass="pb-button pb-button--full-width pb-button--facebook"
            textButton={t('global.facebook')}
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            fields="name,email,picture"
            icon={<SvgIcon name={"facebook"} parentClassName={'pb-button__icon-left'} />}
            callback={onFacebookSignIn}
          />
          <GoogleLogin
            className="pb-button pb-button--full-width pb-button--google"
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onSuccess={onGoogleSignIn}
            onFailure={onGoogleSignIn}
          >
            <SvgIcon name={"google"} parentClassName={'pb-button__icon-left'} />
            <span>{t('global.googlePlus')}</span>
          </GoogleLogin>
        </Columnizer>
      </div>
    );
  }

  return null;
}

const MessageEl = ({baseClassName, t, stage}) => {
  if (stage === userAuthStages.resetPassword) {
    return <p className={`${baseClassName}__message`}>{t(`AuthModal.message-${stage}`)}</p>;
  }

  return null;
};

const AlertEl = ({baseClassName, t, message, messageType}) => {
  if (message) {
    return <Alert theme={messageType}>{message}</Alert>;
  }

  return null;
};

const BackToLoginLinkEl = ({baseClassName, t, stage, onBackToLogin}) => {
  if ((stage === userAuthStages.resetPassword ||
    stage === userAuthStages.onlyMessage) &&
    onBackToLogin) {
    return (
      <div className={`${baseClassName}__link`}>
        <Link onClick={onBackToLogin}>{t('AuthModal.back-to-login')}</Link>
      </div>
    );
  }

  return null;
};

const RememberMeEl = ({t, baseClassName, stage, rememberMe, onRemeberMeChange}) => {
  if (stage === userAuthStages.password) {
    return <Checkbox
      label={t('AuthModal.label-remember-me')}
      id="auth-modal-remember-me"
      onChange={onRemeberMeChange}
      checked={rememberMe}
      inline
      />
  }

  return null;
};


@translate()
class AuthModal extends Component {
  static defaultProps = {
    userType: 'reader',
    stage: userAuthStages.empty,
    backgroundUrl: 'https://storage.googleapis.com/story-weaver-e2e-production/illustration_crops/23275/size7/7180ab1f3fede909148ef8c30f7d7b82.jpg'
  }

  onKeyDown = (e) => {
    if (e.keyCode === keyCodes.return) {
      if (this.props.nextStageEnabled) {
        this.props.onNext()
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const baseClassName = 'pb-auth-modal';
    const {
      stage,
      parentClassName,
      onClose,
      backgroundUrl,
      viewport,
      onNext,
      onBack,
      onFacebookSignIn,
      onGoogleSignIn,
      onForgotPassword,
      languageOptions,
      t,
      email,
      firstName,
      lastName,
      userType,
      onUserTypeChange,
      onOrgTypeChangeClick,
      createNewOrg,
      organisations,
      onChangeEmail,
      onChangePassword,
      onChangeConfirmPassword,
      onChangeFirstName,
      onChangeLastName,
      isLoadingBack,
      isLoadingNext,
      onChangeLanguages,
      onChangeLanguagesSearchValue,
      languagesSearchValue,
      languagesValues,
      onOrganisationSearchChange,
      onOrganisationChange,
      onOrganisationNameChange,
      organisation,
      onChangeCountry,
      onChangeChildren,
      onChangeClassrooms,
      message,
      countries,
      messageType,
      onBackToLogin,
      onRemeberMeChange,
      rememberMe,
      nextStageEnabled,
      backStageEnabled,
      country,
      children,
      classrooms,
      validationErrors,
      onCountrySearchChange,
      onClickResendConfirmation
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    const backButtonEl =
      <Button
        label={t("global.back")}
        iconLeft="chevron-left"
        onClick={onBack}
        loading={isLoadingBack}
        fullWidth
      />

    const nextButtonEl =
      <Button
        label={t("global.next")}
        iconRight="chevron-right"
        variant="primary"
        onClick={onNext}
        loading={isLoadingNext}
        fullWidth
        disabled={!nextStageEnabled}
      />

    return (
      <div className={classNames(classes)}>
        <Modal
          onClose={onClose}
          fillViewport={!viewport.medium}
          noContentPadding
          noDimensionRestrictions
        >
          <Halver
            parentClassName={`${baseClassName}__halver`}
            backgroundUrl={backgroundUrl}>
            <div className={`${baseClassName}__content`}>
              {
                stage !== userAuthStages.onlyMessage
                ?
                <h1 className={`${baseClassName}__title`}>{t(`AuthModal.title-${stage}`)}</h1>
                :
                null
              }
              <MessageEl t={t} baseClassName={baseClassName} stage={stage} />

              <AlertEl t={t} baseClassName={baseClassName} message={message} messageType={messageType} />
              <EmailTextFieldEl onChange={onChangeEmail} t={t} email={email} baseClassName={baseClassName} stage={stage} validationErrors={validationErrors}/>
              <FirstNameTextFieldEl onChange={onChangeFirstName} t={t} firstName={firstName} baseClassName={baseClassName} stage={stage} validationErrors={validationErrors}/>
              <LastNameTextFieldEl onChange={onChangeLastName} t={t} lastName={lastName} baseClassName={baseClassName} stage={stage} validationErrors={validationErrors}/>
              <PasswordTextFieldEl onChange={onChangePassword} t={t} baseClassName={baseClassName} stage={stage} validationErrors={validationErrors}/>
              {
                (stage === userAuthStages.password)
                ?
                <Columnizer>
                  <RememberMeEl t={t} baseClassName={baseClassName} stage={stage} onRemeberMeChange={onRemeberMeChange} rememberMe={rememberMe}/>
                  <ForgoPasswordLinkEl t={t} baseClassName={baseClassName} stage={stage} onForgotPassword={onForgotPassword}/>
                </Columnizer>
                :
                null

              }
              <ConfirmPasswordTextFieldEl onChange={onChangeConfirmPassword} t={t} baseClassName={baseClassName} stage={stage} validationErrors={validationErrors}/>
              <LanguagePicklistEl checkedValues={languagesValues} onChange={onChangeLanguages} onSearchChange={onChangeLanguagesSearchValue} searchValue={languagesSearchValue} t={t} baseClassName={baseClassName} stage={stage} languageOptions={languageOptions}/>

              <UserTypeRadioGroupEl
                t={t}
                baseClassName={baseClassName}
                stage={stage}
                userType={userType}
                onUserTypeChange={onUserTypeChange}/>

              <OrganisationDetailsEl
                t={t}
                baseClassName={baseClassName}
                stage={stage}
                userType={userType}
                createNewOrg={createNewOrg}
                onOrgTypeChangeClick={onOrgTypeChangeClick}
                onOrganisationSearchChange={onOrganisationSearchChange}
                onChange={onOrganisationChange}
                onOrganisationNameChange={onOrganisationNameChange}
                organisations={organisations}
                organisation={organisation}
                onChangeClassrooms={onChangeClassrooms}
                onChangeCountry={onChangeCountry}
                onChangeChildren={onChangeChildren}
                countries={countries}
                country={country}
                children={children}
                classrooms={classrooms}
                onCountrySearchChange={onCountrySearchChange}
                validationErrors={validationErrors}
              />

              {
                stage !== userAuthStages.onlyMessage
                ?
                  // If backStageEnabled, I will show both Back and Next button , else only Next button
                  backStageEnabled
                  ?
                  <Columnizer>
                    {backButtonEl}
                    {nextButtonEl}
                  </Columnizer>
                  :
                  nextButtonEl
                :
                null
              }

              <BackToLoginLinkEl t={t} baseClassName={baseClassName} stage={stage} onBackToLogin={onBackToLogin} />

              <div className={`${baseClassName}__confirm__link`}>
                {
                  (stage === userAuthStages.password || stage === userAuthStages.empty)
                  ?
                  <Link parentClassName={`${baseClassName}__link`} onClick={onClickResendConfirmation}>{t("AuthModal.confirmation-link")}</Link>
                  :
                  null
                }
              </div>
              <SocialSignInEls
                baseClassName={baseClassName}
                t={t}
                stage={stage}
                onGoogleSignIn={onGoogleSignIn}
                onFacebookSignIn={onFacebookSignIn} />
            </div>
          </Halver>
        </Modal>
      </div>
    );
  }
}

AuthModal.propTypes = {
  parentClassName: PropTypes.string,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  onFacebookSignIn: PropTypes.func,
  onGoogleSignIn: PropTypes.func,
  onForgotPassword: PropTypes.func,
  onBackToLogin: PropTypes.func,
  backgroundUrl: PropTypes.string,
  stage: PropTypes.oneOf(Object.keys(userAuthStages)),
  viewport: PropTypes.object.isRequired,
  languageOptions: PropTypes.arrayOf(PropTypes.object),
  userType: PropTypes.oneOf([
    'reader',
    'volunteer'
  ]),
  onUserTypeChange: PropTypes.func,
  onOrgTypeChangeClick: PropTypes.func,
  onRemeberMeChange: PropTypes.func,
  createNewOrg: PropTypes.bool,
  rememberMe: PropTypes.bool,
  organistaions: PropTypes.array,
  message: PropTypes.node,
  messageType: PropTypes.oneOf([
    'info',
    'danger',
    'success',
    'warning'
  ])
};

export default AuthModal;
