import React, { Component } from 'react';
import { connect } from 'react-redux';

import Home from '../Home';
import { fetchBannerImagesWorkflow, fetchHomeWorkflow, fetchRecommendationsWorkflow } from '../../redux/homeActions';
import { fetchBookAssetsWorkflow } from '../../redux/bookActions';

const mapStateToProps = ({ home, viewport, book: { assets, isFetchingAssets }, user}) => {
  return {
    bannerImages: home.bannerImages,
    editorsPick: home.editorsPick,
    newArrivals: home.newArrivals,
    mostRead: home.mostRead,
    blogPosts: home.blogPosts,
    recommendedStories: home.recommendedStories,
    statistics: home.statistics,
    viewport,
    assets,
    isFetchingAssets,
    profile: user.profile
  }
}

const mapDispatchToProps = {
  fetchHomeWorkflow,
  fetchBannerImagesWorkflow,
  fetchRecommendationsWorkflow,
  fetchBookAssetsWorkflow 
}



@connect(mapStateToProps, mapDispatchToProps)
class HomeContainer extends Component {
  componentWillMount() {
    this.props.fetchBannerImagesWorkflow();
    this.props.fetchHomeWorkflow();
    this.props.fetchRecommendationsWorkflow();
  }

  render() {
    const {
      bannerImages,
      editorsPick,
      newArrivals,
      mostRead,
      recommendedStories,
      statistics,
      blogPosts,
      viewport,
      fetchBookAssetsWorkflow,
      assets,
      isFetchingAssets,
      profile
    } = this.props;

    return (
      <Home
        heroCarouselSlides={bannerImages}
        editorsPick={editorsPick}
        newArrivals={newArrivals}
        mostRead={mostRead}
        bookSuggestions={recommendedStories}
        blogPosts={blogPosts}
        viewport={viewport}
        onReadClicked={fetchBookAssetsWorkflow}
        assets={assets}
        isFetchingAssets={isFetchingAssets}
        hasUserHistory={profile.hasHistory}
        statistics={statistics}
        profile={profile}
      />
    );
  }
}

export default HomeContainer;
