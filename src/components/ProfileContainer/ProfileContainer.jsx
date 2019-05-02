import React, { Component } from 'react';
import { connect } from 'react-redux';
import Profile from '../Profile';
import { fetchProfileWorkflow, loadMoreWorkflow } from '../../redux/profileActions';
import LoaderBlock from '../LoaderBlock';
import Block from '../Block';
import { addSlimNotification } from '../../redux/slimNotificationActions';

const mapStateToProps = ({ profile, viewport, user }) => ({
  isFetchingProfile: profile.isFetchingProfile,
  isFetchingMore: profile.isFetchingMore,
  profile: profile.profile,
  viewport,
  siteUser: user
});

const mapDispatchToProps = {
  fetchProfileWorkflow,
  loadMoreWorkflow,
  addSlimNotification
};

@connect(mapStateToProps, mapDispatchToProps)
class ProfileContainer extends Component {
  componentWillMount() {
    this.props.fetchProfileWorkflow(
      this.props.match.params.slug,
      this.props.profileType
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      this.props.fetchProfileWorkflow(
        nextProps.match.params.slug,
        nextProps.profileType
      );
    }
  }

  render() {
    const {
      isFetchingProfile,
      profile,
      profileType,
      viewport,
      loadMoreWorkflow,
      isFetchingMore,
      siteUser, 
      addSlimNotification
    } = this.props;

    if (isFetchingProfile || !profile[profileType]) {
      return <LoaderBlock />;
    }

    if (!isFetchingProfile && !profile) {
      return <Block><h1>Error fetching profile</h1></Block>;
    }

    const isCurrentUser = siteUser.isLoggedIn &&
                          siteUser.profile &&
                          siteUser.profile.email === profile[profileType].email;

    return (
      <Profile
        type={profileType}
        profile={profile[profileType]}
        viewport={viewport}
        loadMore={loadMoreWorkflow}
        isFetchingMore={isFetchingMore}
        isCurrentUser={isCurrentUser}
        addSlimNotification = {addSlimNotification}
      />
    );
  }
}

ProfileContainer.propTypes = {

};

export default ProfileContainer;
