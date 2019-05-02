import React, { Component } from 'react';
import Button from '../Button';
import Link from '../Link';
import { translate } from 'react-polyglot';
import './SiteFooterNotice.scss';
import { links } from '../../lib/constants';

@translate()
class SiteFooterNotice extends Component {

  render() {
    const baseClassName = 'pb-site-footer-notice';

    const {
      t,
      onClick
    } = this.props;

    return (
      <div>
        {t("SiteFooterNotice.text")} <Link href={links.termsOfUse()}> {t("SiteFooterNotice.terms-and-conditions")} </Link> {t("SiteFooterNotice.and")} <Link href={links.privacyPolicy()}> {t("SiteFooterNotice.privacy-policy")}. </Link> 
        <Button parentClassName={`${baseClassName}__agree-btn`}
          label= {t('SiteFooterNotice.agree')}
          onClick = {onClick}
        />
      </div>
    );
  }
}


export default SiteFooterNotice;
