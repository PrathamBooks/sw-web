import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import onClickOutside from 'react-onclickoutside';

import Logo from '../Logo';
import SiteNavLink from '../SiteNavLink';
import SvgIcon from '../SvgIcon';
import Dropdown from '../Dropdown';
import List from '../List';
import Link from '../Link';
import Loader from '../Loader';
import SearchModal from '../SearchModal';

import { links } from '../../lib/constants';

import './SiteHeader.scss';

@translate()
@onClickOutside
class SiteHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      isSearchModalOpen: false
    }
  }

  onMenuToggle = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }

  handleMenuClose = () => {
    this.setState({
      menuOpen: false
    });
  }

  handleClickOutside = () => {
    if (this.state.menuOpen) {
      this.setState({
        menuOpen: false
      });
    }
  }

  onLogout = () => {
    this.props.logout()
      .then(() => {
        window.location.href = links.home()
      })
  }

  isActive = (child) => {
    if (child.props.href && window.location.pathname.includes(child.props.href.split('?')[0])) {
      return React.cloneElement(child, {
        active: true
      });
    }

    return child;
  }

  onOpenSearchModal = () => this.setState({ isSearchModalOpen: true })
  onCloseSearchModal = () => this.setState({ isSearchModalOpen: false })
  onSearch = (query) => {
    if (query) {
      window.location.href = links.searchBy(query);
    } else {
      const { user: { languagePreferences, readingLevels }} = this.props;
      window.location.href = links.allBooks(void 0, languagePreferences, readingLevels);
    }
  }

  onCreateClicked = () => {
    const { viewport, addSlimNotification, isLoggedIn, openAuthModal, t } = this.props;

    if (!isLoggedIn) {
      if(process.env.REACT_APP_FEATURE_AUTH) {
        openAuthModal();
      }
      else {
        window.location.href = links.login();
      }
      return;
    }

    if (viewport.medium) {
      window.location.href = links.create();
    } else {
      addSlimNotification({
        id: 'Book.mobile-editor-notification',
        content: t('Book.mobile-editor-notification-text'),
      });
    }
  }

  render() {
    const baseClassName = 'pb-site-header';
    const classNames = [baseClassName];
    const { t, isLoggedIn, user, user: { languagePreferences, readingLevels }, isFetchingMe, viewport, offline, openAuthModal } = this.props;
    const { menuOpen, isSearchModalOpen } = this.state;

    const allLinks = [
      <Link key="rate-a-story" fullWidth href={links.rateStory()}>{t('global.rate-a-story')}</Link>,
      <Link key="translate-a-story" fullWidth href={links.untranslatedStories()}>{t('global.translate-a-story')}</Link>,
      <Link key="content-manager-dashboard" fullWidth href={links.dashboard()}>{t('global.content-manager-dashboard')}</Link>,
      <Link key="contest-dashboard" fullWidth href={links.contests()}>{t('global.contest-dashboard')}</Link>,
      <Link key="blog-dashboard" fullWidth href={links.blogDashboard()}>{t('global.blog-dashboard')}</Link>,
      <Link key="rating-dashboard" fullWidth href={links.ratingDashboard()}>{t('global.rating-dashboard')}</Link>,
      <Link key="translation-dashboard" fullWidth href={links.translationDashboard()}>{t('global.translation-dashboard')}</Link>,
      <Link key="analytics" fullWidth href={links.analytics()}>{t('global.analytics')}</Link>
    ];

    const mapRoleToLinks = {
      content_manager: ['content-manager-dashboard', 'contest-dashboard', 'blog-dashboard', 'rating-dashboard', 'translation-dashboard', 'analytics', 'rate-a-story'],
      promotion_manager: ['contest-dashboard', 'blog-dashboard'],
      partnerships_manager: ['analytics'],
      reviewer: ['rate-a-story'],
      translator: ['translate-a-story'],
      user: []
    }

    const optionalLinks = allLinks.filter(link => {
      return user.roles.reduce((links, role) => {
        return links.concat(mapRoleToLinks[role])
      }, []).includes(link.key)
    })

    let siteNavLinks = [
      <SiteNavLink key="stories" variant="bordered" respondWidth href={links.allBooks(void 0, languagePreferences, readingLevels)}>{t("global.read", 1)}</SiteNavLink>,
      <SiteNavLink key="audio stories" variant="bordered" respondWidth href={links.allAudioBooks(void 0, languagePreferences, readingLevels)}>{t("Book.listen", 1)}</SiteNavLink>,
      <SiteNavLink key="create" variant="bordered" respondWidth onClick={this.onCreateClicked}>{t("global.create")}</SiteNavLink>,
      <SiteNavLink key="translate" variant="bordered" respondWidth href={links.translate()}>{t("global.translate")}</SiteNavLink>,
      <SiteNavLink key="image" variant="bordered" respondWidth
        href={ process.env.REACT_APP_FEATURE_ILLUSTRATIONS ? links.allIllustrations() : links.images() }>{t("global.image", 2)}</SiteNavLink>,
      <SiteNavLink key="list" variant="bordered" respondWidth href="/lists">{t("global.list", 2)}</SiteNavLink>
    ]

    siteNavLinks = siteNavLinks.map(this.isActive);

    if (menuOpen) {
      classNames.push(`${baseClassName}--menu-open`);
    }

    let userLinkEls;
    if (isLoggedIn) {
      userLinkEls = [
        <Link key="profile" fullWidth href={links.userProfile(user.id)}>{t('global.profile', 1)}</Link>,
        <Link key="dashboard" fullWidth href={links.profileDashboard()}>{t('global.dashboard')}</Link>,
        /*<Link key="my-List" fullWidth href={links.myLists()}>{t('global.my-lists')}</Link>, */
        ...optionalLinks,
        <Link onClick={this.onLogout} key="sign-out" fullWidth>{t('global.sign-out')}</Link>
      ];
    }

    let userInfoEls;
    if (isFetchingMe) {
      userInfoEls = (
        <div className={`${baseClassName}__link-placeholder`}>
          <Loader />
        </div>
      );
    } else if (isLoggedIn) {
      userInfoEls = (
        <Dropdown
          toggleEl={<SiteNavLink parentClassName={`${baseClassName}__dropdown-link`} respondFontSize truncateLongText caret='down'>{user.first_name}</SiteNavLink>}
          parentClassName={`${baseClassName}__dropdown`}
          toggleClassName={`${baseClassName}__dropdown-toggle`}>
          <List nowrap>{userLinkEls}</List>
        </Dropdown>
      );
    } else {
      userInfoEls =
        process.env.REACT_APP_FEATURE_AUTH
          ?
          [
            <SiteNavLink key="sign-up-log-in" respondFontSize onClick={openAuthModal}>{t("global.sign-up-log-in")}</SiteNavLink>
          ]
          :
          [
            <SiteNavLink key="sign_up" respondFontSize href={links.signup()}>{t("global.sign-up")}</SiteNavLink>,
            <SiteNavLink key="log_in" respondFontSize href={links.login()}>{t("global.log-in")}</SiteNavLink>
          ]
    }

    const offlineNavEl = (
      <SiteNavLink
        isInternal
        href={links.offlineBooks()}
        respondWidth={!offline}
        title={t("global.offline-library", 2)}
        variant={this.props.viewport.large ? 'default' : 'bordered'}
        disabled={!('serviceWorker' in navigator)}
      >
        <SvgIcon variant={window.location.pathname.includes('/offline') ? 'accent' : null} name="offline" size="m" /> {this.props.viewport.large || offline ? null : t("global.offline-library", 2)}
      </SiteNavLink>
    );

    let searchEl = (
      <SiteNavLink
        onClick={this.onOpenSearchModal}
        respondWidth
        variant={this.props.viewport.large ? 'default' : 'bordered'}
      >
        <SvgIcon name="search" size="m"/> {this.props.viewport.large ? null : t('global.search')}
      </SiteNavLink>
    );

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__container`}>
          <div className={`${baseClassName}__brand`}>
            <Logo href={links.home()} parentClassName={`${baseClassName}__logo`} />
          </div>
          <div className={`${baseClassName}__nav-primary`}>
            {((!this.props.viewport.large && menuOpen) || offline) ? null : userInfoEls }

            {
              process.env.REACT_APP_FEATURE_OFFLINE
              ?
              this.props.viewport.large || offline ? offlineNavEl : null
              :
              null
            }

            {this.props.viewport.large && !offline ? searchEl : null}
            {
              this.props.viewport.large || offline
              ?
              null
              :
              <SiteNavLink onClick={this.onMenuToggle}><SvgIcon name={menuOpen ? "close" : "menu"} size="m"/></SiteNavLink>
            }
          </div>
          {
            offline
            ?
            null
            :
            (
              <div className={`${baseClassName}__nav-secondary`} onClick={!this.props.viewport.medium ? this.handleMenuClose : null}>
                {siteNavLinks}

                {
                  process.env.REACT_APP_FEATURE_OFFLINE
                  ?
                  !this.props.viewport.large ? offlineNavEl : null
                  :
                  null
                }

                {!this.props.viewport.large ? searchEl : null}
              </div>
            )
          }
        </div>
        {
          !offline && isSearchModalOpen
          ?
          <SearchModal
            viewport={viewport}
            onClose={this.onCloseSearchModal}
            onSubmit={this.onSearch}
          />
          :
          null
        }
      </div>
    );
  }
}

SiteHeader.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string
  }),
  viewport: PropTypes.object,
  logout: PropTypes.func.isRequired,
  offline: PropTypes.bool,
  openAuthModal: PropTypes.func,
  closeAuthModal: PropTypes.func
};

export default SiteHeader;
