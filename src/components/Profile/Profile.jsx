import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title'
import { profileTypes } from '../../lib/constants';
import { getHostname } from '../../lib/urls';

import Breadcrumb from '../Breadcrumb';
import Columnizer from '../Columnizer';
import Avatar from '../Avatar';
import Tabs from '../Tabs';
import Tab from '../Tab';
import Books from '../Books';
import ImageAlbums from '../ImageAlbums';
import ReadingLists from '../ReadingLists';
import MediaMentions from '../MediaMentions';
import InfoUnit from '../InfoUnit';
import Link from '../Link';
import SocialLinks from '../SocialLinks';
import Block from '../Block';
import Shrinker from '../Shrinker';
import { MediaObject, Media, Body } from '../MediaObject';
import Pagination from '../Pagination';
import BlankSlate from '../BlankSlate';
import Button from '../Button';

import { links } from '../../lib/constants';

import './Profile.scss';

import onEmptyBgImage from '../../assets/watering-can.svg';
import onEmptyBgImageSelf from '../../assets/hand-with-pencil.svg';

const ContactDetailsEl = ({t, baseClassName, profile, type, viewport}) => {
  let el = null;
  if (type !== profileTypes.USER) {
    const itemsEl = [
      (
        profile.email
        ?
        <InfoUnit label={t("global.email", 1)} noWrap key={profile.email}>
          <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
        </InfoUnit>
        :
        null
      ),
      (
        profile.website
        ?
        <InfoUnit label={t("global.website", 1)} noWrap key={profile.website}>
          <Link shouldOpenNewPage={true} href={profile.website}>{getHostname(profile.website)}</Link>
        </InfoUnit>
        :
        null
      )
    ];

    if (viewport.medium) {
      el = <Columnizer parentClassName={`${baseClassName}__contact`}>{itemsEl}</Columnizer>;
    } else {
      el = <div className={`${baseClassName}__contact`}>{itemsEl}</div>;
    }
  }

  return el;
};

@translate()
class Profile extends Component {
  onCreateClicked = () => {
    const { viewport, addSlimNotification, t } = this.props;
    if (viewport.medium) {
      window.location.href = links.create();
    } else {
      addSlimNotification({
        id: 'Book.mobile-editor-notification',
        content: t('Book.mobile-editor-notification-text'),
      });
    }
  }
  renderDescriptionEl(baseClassName, mapProfileTypeToSlug) {
    const {
      t,
      profile,
      viewport,
      type
    } = this.props;

    const disableDescShrinking = (type === profileTypes.USER) || viewport.medium || (profile.description && profile.description.length < 100);

    return (
      <div className={`${baseClassName}__description`}>
        {
          (type === profileTypes.USER && profile.organisation)
          ?
          <p>
            {t("Profile.part-of")}
            {' '}
            <Link
              isInternal={true}
              href={links.profile(mapProfileTypeToSlug[profile.organisation.type.toLowerCase()], profile.organisation.slug)}
            >
              {profile.organisation.name}
            </Link>
          </p>
          :
          null
        }
        <Shrinker
          disabled={disableDescShrinking}>
          {profile.description}
        </Shrinker>
      </div>
    );
  }

  render() {
    const baseClassName = 'pb-profile';
    const classNames = [baseClassName];

    const { t, type, profile, viewport, loadMore, isFetchingMore, isCurrentUser } = this.props;

    const breadcrumbPath = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];

    const mapProfileTypeToSlug = {
      [profileTypes.ORGANISATION]: 'organisations',
      [profileTypes.PUBLISHER]: 'publishers',
      [profileTypes.USER]: 'users'
    }

    const { socialMediaLinks } = profile;
    let facebookUrl, rssUrl, twitterUrl, youtubeUrl;
    if (socialMediaLinks) {
      ({ facebookUrl, rssUrl, twitterUrl, youtubeUrl } = socialMediaLinks);
    }

    // TODO: Clean this up? Looks dirty.

    let tabs, title, url, writeBook = '';
    if (isCurrentUser){
      url = onEmptyBgImageSelf;
      title = t("Profile.empty-content-self");
      writeBook = <Button
        label={t("Profile.write-book")}
        variant="primary"
        parentClassName={`${baseClassName}__create-book`}
        onClick={this.onCreateClicked}
      />
    } else {
      url = onEmptyBgImage;
      title = t("Profile.empty-content");
    }

    const blankSlateBooksEl = <BlankSlate title = {title} url = {url}>{writeBook}</BlankSlate>;
    const blankSlateEl = <BlankSlate title = {title} url = {url}></BlankSlate>;

    if (type === profileTypes.USER) {
      tabs = [
        // User books.
        (!Boolean(profile.books.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-books" title={`${t('global.story', 2)} (${profile.books.meta.hits})`} hasContent={Boolean(profile.books.meta.hits)}>
            {
              Boolean(profile.books.meta.hits)
              ?
              <Books books={profile.books.results} />
              :
              blankSlateBooksEl
            }
          </Tab>
        ),
        
        // User illustrations
        (!Boolean(profile.illustrations.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-illustrations" title={`${t('global.illustration', 2)} (${profile.illustrations.meta.hits})`} hasContent={Boolean(profile.illustrations.meta.hits)}>
            {
              Boolean(profile.illustrations.meta.hits)
              ?
              (
                <div>
                  <ImageAlbums illustrations={profile.illustrations.results} />
                  {
                    (profile.illustrations.meta.page < profile.illustrations.meta.totalPages)
                    ?
                    <Pagination loading={isFetchingMore} onClick={loadMore.bind(this, profileTypes.USER, profile.name, profile.slug, 'illustrations', (profile.illustrations.meta.page + 1))} />
                    :
                    null
                  }
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // User translations.
        (!Boolean(profile.translations.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-translations" title={`${t('global.translation', 2)} (${profile.translations.meta.hits})`} hasContent={Boolean(profile.translations.meta.hits)}>
            {
              Boolean(profile.translations.meta.hits)
              ?
              <Books books={profile.translations.results} />
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // User releveled Stories
        (!Boolean(profile.releveled_stories.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-releveled-stories" title={`${t('global.releveled')} (${profile.releveled_stories.meta.hits})`} hasContent={Boolean(profile.releveled_stories.meta.hits)}>
            {
              Boolean(profile.releveled_stories.meta.hits)
              ?
              <Books books={profile.releveled_stories.results} />
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // User lists.
        (!Boolean(profile.lists.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-lists" title={`${t('global.my-bookshelf')} (${profile.lists.meta.hits})`} hasContent={Boolean(profile.lists.meta.hits)}>
            {
              Boolean(profile.lists.meta.hits)
              ?
              (
                <div className={`${baseClassName}__lists`}>
                  <ReadingLists lists={profile.lists.results} />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // User media mentions.
        (!Boolean(profile.mediaMentions.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="user-media-mentions" title={`${t('global.media-mention', 2)} (${profile.mediaMentions.meta.hits})`} hasContent={Boolean(profile.mediaMentions.meta.hits)}>
            {
              Boolean(profile.mediaMentions.meta.hits)
              ?
              (
                <div className={`${baseClassName}__media-mentions`}>
                  <MediaMentions mediaMentions={profile.mediaMentions.results} />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        )
      ];
    } else if (type === profileTypes.ORGANISATION) {
      tabs = [
        // Organisation lists
        (!Boolean(profile.reading_lists.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="organization-reading-lists" title={`${t('global.my-bookshelf')} (${profile.reading_lists.meta.hits})`} hasContent={Boolean(profile.reading_lists.meta.hits)}>
            {
              Boolean(profile.reading_lists.meta.hits)
              ?
              (
                <div className={`${baseClassName}__lists ${baseClassName}__lists--narrow`}>
                  <ReadingLists lists={profile.reading_lists.results} showDescription />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // Organisation media mentions
        (!Boolean(profile.mediaMentions.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="organization-media-mentions" title={`${t('global.media-mention', 2)} (${profile.mediaMentions.meta.hits})`} hasContent={Boolean(profile.mediaMentions.meta.hits)}>
            {
              Boolean(profile.mediaMentions.meta.hits)
              ?
              (
                <div className={`${baseClassName}__media-mentions`}>
                  <MediaMentions mediaMentions={profile.mediaMentions.results} />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        )
      ]
    } else if (type === profileTypes.PUBLISHER) {
      tabs = [
        // Publisher new arrivals.
        (!Boolean(profile.newArrivals.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="publisher-new-arrivals" title={`${t('global.new-arrival', 2)} (${profile.newArrivals.meta.hits})`} hasContent={Boolean(profile.newArrivals.meta.hits)}>
            {
              Boolean(profile.newArrivals.meta.hits)
              ?
              (
                <div>
                  <Books books={profile.newArrivals.results} />
                  {
                    (profile.newArrivals.meta.page < profile.newArrivals.meta.totalPages)
                    ?
                    <Pagination loading={isFetchingMore} onClick={loadMore.bind(this, profileTypes.PUBLISHER, profile.name, profile.slug, 'newArrivals', (profile.newArrivals.meta.page + 1))} />
                    :
                    null
                  }
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),
        
        // Publisher editor's picks.
        (!Boolean(profile.editorsPick.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="publisher-editors-pick" title={`${t('global.editors-pick', 2)} (${profile.editorsPick.meta.hits})`} hasContent={Boolean(profile.editorsPick.meta.hits)}>
            {
              Boolean(profile.editorsPick.meta.hits)
              ?
              (
                <div>
                  <Books books={profile.editorsPick.results} />
                  {
                    (profile.editorsPick.meta.page < profile.editorsPick.meta.totalPages)
                    ?
                    <Pagination loading={isFetchingMore} onClick={loadMore.bind(this, profileTypes.PUBLISHER, profile.name, profile.slug, 'editorsPick', (profile.editorsPick.meta.page + 1))} />
                    :
                    null
                  }
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),

        // Publisher reading lists.
        (!Boolean(profile.reading_lists.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="publisher-reading-lists" title={`${t('global.list', 2)} (${profile.reading_lists.meta.hits})`} hasContent={Boolean(profile.reading_lists.meta.hits)}>
            {
              Boolean(profile.reading_lists.meta.hits)
              ?
              (
                <div className={`${baseClassName}__lists ${baseClassName}__lists--narrow`}>
                  <ReadingLists lists={profile.reading_lists.results} showDescription />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        ),

        // Publisher media mentions.
        (!Boolean(profile.mediaMentions.meta.hits) && !isCurrentUser)
        ?
        null
        :
        (
          <Tab key="publisher-media-mentions" title={`${t('global.media-mention', 2)} (${profile.mediaMentions.meta.hits})`} hasContent={Boolean(profile.mediaMentions.meta.hits)}>
            {
              Boolean(profile.mediaMentions.meta.hits)
              ?
              (
                <div className={`${baseClassName}__media-mentions`}>
                  <MediaMentions mediaMentions={profile.mediaMentions.results} />
                </div>
              )
              :
              blankSlateEl
            }
          </Tab>
        )
      ]
    }

    const breadcrumbEl = <Breadcrumb paths={breadcrumbPath} />;
    return (
      <div className={classNames.join(' ')}>
        <DocumentTitle title={`${profile.name} - ${t("global.site-title")}`}/>
        <Block>
           { !viewport.medium ? breadcrumbEl : null }
          <MediaObject>
            <Media>
              <div className={`${baseClassName}__avatar`}>
                <Avatar url={profile.profileImage} name={profile.name} variant={type === profileTypes.USER ? 'circular' : 'default'} size="l" />
              </div>
            </Media>
            <Body>
              { viewport.medium ? breadcrumbEl : null }
              <h1 className={`${baseClassName}__title`}>{profile.name}</h1>
              <div className={`${baseClassName}__summary`}>
                <div className={`${baseClassName}__summary-col-1`}>
                  {this.renderDescriptionEl(baseClassName, mapProfileTypeToSlug)}
                  <ContactDetailsEl
                    t={t}
                    baseClassName={baseClassName}
                    profile={profile}
                    type={type}
                    viewport={viewport} />
                </div>
                {
                  type === profileTypes.USER
                  ?
                  null
                  :
                  (
                    <div className={`${baseClassName}__summary-col-2`}>
                      <div className={`${baseClassName}__social`}>
                        <SocialLinks links={{
                            facebook: facebookUrl,
                            rss: rssUrl,
                            twitter: twitterUrl,
                            youtube: youtubeUrl
                          }}
                          variant="circular"/>
                      </div>
                    </div>
                  )
                }
              </div>
            </Body>
          </MediaObject>
        </Block>
        <Block noHorizontalPadding>
          {tabs.some((item) => item != null) ?
            <Tabs parentClassName={`${baseClassName}__section-tabs`}>
              {tabs}
            </Tabs>
            :
            blankSlateEl
          }
        </Block>
      </div>
    );
  }
}

Profile.propTypes = {
  type: PropTypes.string,
  profile: PropTypes.object,
  viewport: PropTypes.object
};

export default Profile;
