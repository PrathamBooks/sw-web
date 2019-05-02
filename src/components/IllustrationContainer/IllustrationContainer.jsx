import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import Block from '../Block';
import LoaderBlock from '../LoaderBlock';
import {
  fetchIllustrationWorkflow,
  likeIllustrationWorkflow,
  postFlagIllustrationWorkflow,
  fetchIllustrationDownloadLimitWorkflow
} from '../../redux/illustrationActions';
import { addSlimNotification } from '../../redux/slimNotificationActions';
import { addNotificationModal } from '../../redux/notificationModalActions';
import { recordGaEvents, recordIllustrationDownload } from '../../redux/googleAnalyticsActions';
import { openAuthModal } from '../../redux/userActions';
import { links, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';

const mapStateToProps = ({ illustration, viewport, user, network }) => ({
  isFetchingIllustration: illustration.isFetchingIllustration,
  isFetchingIllustrationDownloadLimit: illustration.isFetchingIllustrationDownloadLimit,
  illustration: illustration.illustration,
  viewport,
  isLoggedIn: user.isLoggedIn,
  online: network.online,
  userEmail: user.profile.email,
  name: user.profile.name,
  organisation: user.profile.orgName,
  country: user.profile.country,
  roles: user.profile.roles
 });


 const mapDispatchToProps = {
  fetchIllustrationWorkflow,
  likeIllustrationWorkflow,
  postFlagIllustrationWorkflow,
  openAuthModal,
  recordGaEvents,
  addSlimNotification,
  recordIllustrationDownload,
  addNotificationModal,
  fetchIllustrationDownloadLimitWorkflow
};
@translate()
@connect(mapStateToProps, mapDispatchToProps)

class IllustrationContainer extends Component {
  // static defaultProps = {}
  componentWillMount() {
    this.props.fetchIllustrationWorkflow(this.props.match.params.slug);
  }

  onClickCreateStory = () => {
    const { viewport, addNotificationModal, openAuthModal, isLoggedIn, t, addSlimNotification } = this.props;
    
    if (!isLoggedIn) {
      addNotificationModal({
        title: t("global.log-in"),
        content: t("Illustration.please-log-in-to-create-story"),
        additionalActions: [{
          label: t('global.log-in'),
          primary: true,
          onClick: process.env.REACT_APP_FEATURE_AUTH ? openAuthModal : () => window.location.href = links.login()
        }, {
          label: t('global.sign-up'),
          onClick: () => { window.location.href = links.signup(); }
        }
      ]
      })
      return;
    }
    
    if (viewport.medium) {
      window.location.href = links.createStoryFromIllustration(this.props.illustration.slug);;
    } else {
      addSlimNotification({
        type: 'info',
        content: t('Book.mobile-editor-notification-text'),
      });
    }

  };

  onClickFlag =(slug,reasons) => {
    this.props.postFlagIllustrationWorkflow(slug,reasons);
  }

  onLikeClicked = (slug) => {
    const {
      likeIllustrationWorkflow,
      userEmail,
      illustration,
      recordGaEvents
    } = this.props;
    likeIllustrationWorkflow(slug);

    recordGaEvents({
      eventCategory: gaEventCategories.illustration,
      eventAction: gaEventActions.liked,
      userEmail: userEmail,
      dimension5: illustration.slug
    });
    
  }

  onProfileLinkClicked = (profileSlug, linkType) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: `${sectionClicked.illustrationDetails} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  render() {
    const baseClassName = 'pb-illustration-container';
    const {
      online,
      roles,
      isLoggedIn,
      isFetchingIllustration,
      illustration,
      viewport,
      parentClassName,
      openAuthModal,
      userEmail,
      name,
      organisation,
      country,
      recordIllustrationDownload,
      isFetchingIllustrationDownloadLimit,
      fetchIllustrationDownloadLimitWorkflow
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    if (isFetchingIllustration || !illustration ) {
      return <LoaderBlock />;
    }


    if (!isFetchingIllustration && !illustration) {
      return <Block><h1>Error fetching Image.</h1></Block>;
    }

    return (
      <div className={classNames(classes)}>
        <Illustration
          online={online}
          isPulledDown={illustration.isPulledDown}
          slug={illustration.slug}
          title={illustration.title}
          roles={roles}
          author={illustration.illustrators}
          image={illustration.imageUrls[0]}
          tags={illustration.tags}
          categories={illustration.categories}
          styles={illustration.styles}
          description={illustration.attribution_text}
          usedIn={illustration.usedIn}
          viewport={viewport}
          onClickCreateStory={this.onClickCreateStory}
          readsCount={illustration.readsCount}
          likesCount={illustration.likesCount}
          liked={illustration.liked}
          isLoggedIn={isLoggedIn}
          downloadLinks={illustration.downloadLinks}
          onLikeClicked={this.onLikeClicked}
          onClickFlag={this.onClickFlag}
          isFlagged={illustration.isFlagged}
          similarImages={illustration.similarillustrations}
          openAuthModal={openAuthModal}
          publisher={illustration.publisher}
          downloadLimitReached={illustration.downloadLimitReached}
          recordIllustrationDownload={recordIllustrationDownload}
          userEmail={userEmail}
          name={name}
          organisation={organisation}
          country={country}
          isFetchingIllustrationDownloadLimit={isFetchingIllustrationDownloadLimit}
          fetchIllustrationDownloadLimitWorkflow={fetchIllustrationDownloadLimitWorkflow}
          onProfileLinkClicked={this.onProfileLinkClicked}
          illustration={illustration}
        />
      </div>
    );
  }
}

IllustrationContainer.propTypes = {
  parentClassName: PropTypes.string
};

export default IllustrationContainer;
