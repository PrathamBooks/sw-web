import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';
import u from 'updeep';
import { Helmet } from "react-helmet";

import AuthDropdown from '../AuthDropdown';
import Block from '../Block';
import Breadcrumb from '../Breadcrumb';
import Button from '../Button';
import CardShelf from '../CardShelf';
import ImageCard from '../ImageCard';
import ImgBrowser from '../ImgBrowser';
import Link from '../Link';
import List from '../List';
import Pill from '../Pill';
import Rowifier from '../Rowifier';
import SectionBlock from '../SectionBlock';
import ShareMenu from '../ShareMenu';
import Stat from '../Stat';
import Stuffer from '../Stuffer';
import SvgIcon from '../SvgIcon';
import DownloadsDropdown from './DownloadsDropdown';
import Likes from '../Likes';
import FlagModal from './FlagModal';
import DownloadModal from './DownloadModal';
import Publisher from '../Publisher';
import StructuredDataMarkup from './StructuredDataMarkup';

import { links, linkType,roles as availableRoles } from '../../lib/constants';
import { getSmallestImage, getLargestImage } from '../../lib/images';
import { arrayToI18nList } from '../../lib/textUtils.js';

import ImagesStrip from './ImagesStrip';

import './Illustration.scss';

const FlagEl = ({onClickFlag, isFlagged, t,  isLoggedIn, openAuthModal , isPulledDown}) => {
  let flagText = (isPulledDown) ? t('global.pulled-down') : t('global.flagged') ;
  let content = null;
  
  const flagged = (
    <div>
      <SvgIcon  
        name="flag-filled" 
        size="m"
        variant="accent"
        pushRight />
        {flagText}
    </div>
  );

  const notFlagged = (
    <Link onClick={onClickFlag}>
      <SvgIcon name="flag" size="m" pushRight/>
      {t("global.flag")}
    </Link>
  );

  const notFlaggedEmptyHandler = (
    <Link>
      <SvgIcon name="flag" size="m" pushRight/>
      {t("global.flag")}
    </Link>
  );

  if(isFlagged) {
    content = flagged;
  } else {
      if(isLoggedIn){
          content = notFlagged;
        } else {
          content = (<AuthDropdown
                      t={t}
                      openAuthModal={openAuthModal}
                      toggleEl = { notFlaggedEmptyHandler }
                      loginText = {t('global.please-log-in', {action: t('global.flag',1), content_type: t('global.illustration',1)})}
                    />);
      }
  }

  return (content);
};

const SimilarImagesEl = ({baseClassName, t, similarImages, viewport, onProfileLinkClicked}) => {
  if (similarImages && similarImages.length) {
    return (
      <SectionBlock
        title={t('Illustration.similar')}
        background="transparent"
        >
        <CardShelf
          cellWidth="image-card"
          viewport={viewport}>
          {
            similarImages.map((image, i) => {
              return <ImageCard
                key={`${baseClassName}-i`}
                title={image.title}
                slug={image.slug}
                image={image.imageUrls}
                artists={image.illustrators}
                onProfileLinkClicked={onProfileLinkClicked}
                />;
            })
          }
        </CardShelf>
      </SectionBlock>
    );
  }

  return null;
};

class Illustration extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: {
        flag: false,
      },
    };

  }

  onOpenModal = (modalName) => {
    this.setState(u({
      isModalVisible: {
        [modalName]: true
      }
    }, this.state));
  }

  onCloseModal = (modalName) =>{
    this.setState(u({
      isModalVisible: {
        [modalName]: false
      }
    }, this.state));
  }

  onClickFlag = () => {
    this.onOpenModal('flag');
  }

  onFormLinkClicked = () => {
    const {
      userEmail,
      name,
      organisation,
      country
    } = this.props;
    window.open(links.googleFormIllustrationDownloadLink({userEmail, name, organisation, country}));
    //closing the modal after opening the form
    this.setState(u({
      isModalVisible: {
        download: false
      }
    }, this.state));
  }

  onIllustrationDownload = (downloadLink) => {
    
    this.props.fetchIllustrationDownloadLimitWorkflow(this.props.slug)
    .then(response => {
      const data = response.data
      if(data.downloadLimitReached)
      {
        this.setState(u({
          isModalVisible: {
            download: true
          }
        }, this.state));
      }
      else
      {
        window.open(downloadLink);
      }
    })
  }


  render() {
    const baseClassName = 'pb-illustration';
    const {
      t,
      viewport,
      isLoggedIn,
      slug,
      title,
      description,
      usedIn,
      author,
      tags,
      categories,
      styles,
      roles,
      onClickCreateStory,
      image,
      collection,
      index,
      onClickNext,
      onClickPrevious,
      onClickFlag,
      online,
      isPulledDown,
      similarImages,
      readsCount,
      likesCount,
      downloadLimitReached,
      downloadLinks,
      liked,
      onLikeClicked,
      isFlagged,
      publisher,
      openAuthModal,
      userEmail,
      recordIllustrationDownload,
      onProfileLinkClicked,
      isFetchingIllustrationDownloadLimit,
      illustration
    } = this.props;
    
    const breadcrumbPath = [{
      title: t('global.home'),
      href: links.home()
    }, {
      title: t('global.image', 2),
      href: links.allIllustrations()
    }];

    const classes = {
      [baseClassName]: true
    };


    let artistEls = [];

    if (author) {
      author.forEach(artist => {
        artistEls.push(
            <Link
              key={artist.slug}
              isInternal={true}
              href={`/users/${artist.slug}`}
              onClick={() => {onProfileLinkClicked(artist.slug, linkType.createdBy)}}>
              {artist.name}
              </Link>
        )
      })
    }

    // Here we are merging 'description' with 'usedIn' fields
    // if last character of description doesn't end with '.'(fullstop) we add one.
    let descriptionEl = [];

    if (description) {
      descriptionEl = ( description.length > 0 && description.slice(-1) ==="." ) ?
      [description, " "]
      : 
      [description, ". "];
    }
    
    if (usedIn.totalStories > 0) {
      
      descriptionEl.push(t('Illustration.used-in'));

      for (const [index, story] of usedIn.stories.entries()) {
        
        // display max 5 stories rest should be shown in search page
        if(index > 4) {
          descriptionEl.push( 
            <Link isInternal={true} href={links.searchByIllustration(slug)}>
              {t('Illustration.used-in-more-stories')}
            </Link>
          );
          descriptionEl.push(".")
          break;
        }

        descriptionEl.push( 
          <Link
            key={index}
            isInternal={true}
            href={links.bookDetails(story.slug)}>
          {story.title}
          {story.numDerivations? `(${story.numDerivations})`: null}
          </Link>
        );

        index !==  (usedIn.totalStories - 1) ? descriptionEl.push(", "): descriptionEl.push(".");

      };
    }

    let likeStat = null
    if ((likesCount !== undefined || likesCount !== null) && online)  {
      likeStat = <Likes
                  t={t}
                  isliked={liked}
                  likesCount={likesCount}
                  onLike={() => onLikeClicked(slug)}
                  isLoggedIn={isLoggedIn}
                  openAuthModal={openAuthModal}
                  logInMsg={t('global.please-log-in', 
                    {action: t('global.like',1), content_type: t('global.illustration',1)})}
                />
    }
    const isContentManager = roles && roles.includes(availableRoles.CONTENT_MANAGER);

    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${title} - ${t('global.site-title')}`} />
        <Helmet>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={getSmallestImage(image.sizes).url} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content={getLargestImage(image.sizes).url} />
        </Helmet>
        <StructuredDataMarkup illustration={illustration} />
        <Block>
          <Breadcrumb paths={breadcrumbPath} />
        </Block>
        <Block noHorizontalPadding noVerticalPadding>
             <ImgBrowser
              image={image}
              onClickNext={onClickNext}
              onClickPrevious={onClickPrevious}
              />
        </Block>
        <ImagesStrip
          baseClassName={baseClassName}
          t={t}
          collection={collection}
          currentIndex={index}
          viewport={viewport}
          />
        <Block>
          <Rowifier align="center" separator borderTop>
            <List inline>
              <DownloadsDropdown
                userEmail={userEmail}
                slug={slug}
                recordIllustrationDownload={recordIllustrationDownload}
                downloadLinks={downloadLinks}
                downloadLimitReached={downloadLimitReached}
                isLoggedIn={isLoggedIn}
                openAuthModal={openAuthModal}
                onOpenModal={this.onOpenModal}
                baseClassName={baseClassName}
                onIllustrationDownload={this.onIllustrationDownload}
                isFetchingIllustrationDownloadLimit={isFetchingIllustrationDownloadLimit} />
              <ShareMenu
                title={title}
                href={window.location.href} />
              <div className={`${baseClassName}__stats`}>
                {likeStat}
              </div>
              <FlagEl
                onClickFlag={this.onClickFlag}
                isFlagged={isFlagged}
                t={t}
                isLoggedIn={isLoggedIn}
                isPulledDown={isPulledDown}
                openAuthModal={openAuthModal}
              />
              <Stat
                icon="eye"
                label={t("global.views")}
                value={readsCount} />
            </List>
            <div className={`${baseClassName}__cta`}>
              <Button
                fullWidth
                label={t("Illustration.create-story")}
                variant="primary"
                onClick={onClickCreateStory}/>
            </div>
          </Rowifier>
        </Block>
        <Block background="transparent">
          <Stuffer horizontalSpacing={viewport.large ? 'xl' : null}>
            <div className={`${baseClassName}__content`}>
              <div className={`${baseClassName}__header`}>
                <h1 className={`${baseClassName}__title`}>{title}</h1>
                {t('Illustration.created-by')} {arrayToI18nList(artistEls)}
                <Publisher
                  publisher={publisher}
                  offline={!online}
                  />
                <p className={`${baseClassName}__description`}>{descriptionEl}</p>
              </div>

              <Rowifier align="center" borderTop borderBottom>
                {
                  tags && tags.length
                  ?
                  <List inline>{
                      tags.map(tag => {
                        return <Pill key={tag} label={tag.name} href={links.searchIllustrationsByTag(tag.query)} icon="circle" />
                      })
                    }</List>
                  :
                  null
                }
                {
                  categories && categories.length
                  ?
                  <List inline>{
                      categories.map(category => {
                        return <Pill key={category} label={category.name} href={links.searchIllustrationsByCategory(category.query)} icon="circle" isCategoryPill={isContentManager}/>
                      })
                    }</List>
                  :
                  null
                }
                {
                  styles && styles.length
                  ?
                  <List inline>{
                      styles.map(style => {
                        return <Pill key={style} label={style.name} href={links.searchIllustrationsByStyle(style.query)} icon="circle" isCategoryPill={isContentManager}/>
                      })
                    }</List>
                  :
                  null
                }
              </Rowifier>
            </div>
          </Stuffer>
        </Block>
        <SimilarImagesEl
          baseClassName={baseClassName}
          t={t}
          similarImages={similarImages}
          viewport={viewport}
          onProfileLinkClicked={onProfileLinkClicked}
          />
        <FlagModal
          isVisible={this.state.isModalVisible.flag}
          onCloseClicked={() => this.onCloseModal('flag')}
          onFlagClicked={reasons => onClickFlag(slug, reasons)}
          viewport={viewport}
        />
        <DownloadModal
          isVisible={this.state.isModalVisible.download}
          onCloseClicked={() => this.onCloseModal('download')}
          onFormLinkClicked={this.onFormLinkClicked}
          viewport={viewport}
          userEmail={userEmail}
        />
      </div>
    );
  }
}

Illustration.propTypes = {
  viewport: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  // Author? Should we label as Artist or something?
  author: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  image: PropTypes.object.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  styles: PropTypes.arrayOf(PropTypes.string),
  onClickCreateStory: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrevious: PropTypes.func,
  onClickFlag: PropTypes.func,
  likes: PropTypes.number,
  onClickLike: PropTypes.func,
  liked: PropTypes.bool,
  online: PropTypes.bool,
  similarImages: PropTypes.arrayOf(PropTypes.object)
};

export default translate()(Illustration);
