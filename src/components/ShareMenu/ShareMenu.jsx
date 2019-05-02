import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import List from '../List';
import Dropdown from '../Dropdown';
import Link from '../Link';
import SvgIcon from '../SvgIcon';

import { makeTwitterShareUrl, makeFacebookShareUrl, makeGooglePlusShareUrl } from '../../lib/social';

import './ShareMenu.scss';

class ShareMenu extends Component {
  render() {
    const {
      t,
      title,
      href,
      align,
      onClick
    } =this.props;

    return (
      <Dropdown
        align={align}
        toggleEl={<Link><SvgIcon name="share" size="m" pushRight/>{t("global.share", 1)}</Link>}
      >
        <List nowrap>
          <Link fullWidth
                href={makeTwitterShareUrl(href, title)}
                shouldOpenNewPage={true}
                onClick={onClick}>
            <SvgIcon name="twitter" size="m" pushRight/> {t('global.twitter')}
          </Link>
          <Link fullWidth
                href={makeFacebookShareUrl(href)}
                shouldOpenNewPage={true}
                onClick={onClick}>
            <SvgIcon name="facebook" size="m" pushRight/> {t('global.facebook')}
          </Link>
          <Link fullWidth
                href={makeGooglePlusShareUrl(href)}
                shouldOpenNewPage={true}
                onClick={onClick}>
            <SvgIcon name="google" size="m" pushRight/> {t('global.googlePlus')}</Link>
        </List>
      </Dropdown>
    );
  }
}

ShareMenu.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  align: PropTypes.shape(Dropdown.propTypes.align)
};

export default translate()(ShareMenu);
