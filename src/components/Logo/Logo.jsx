import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import Link from '../Link';

import './Logo.scss';
import logo from './storyweaver-logo.svg';

@translate()
class Logo extends Component {
  render() {
    const { t } = this.props;
    const baseClassName = 'pb-logo';
    const classNames = [baseClassName];

    if (this.props.parentClassName) {
      classNames.push(this.props.parentClassName);
    }

    return (
      <Link parentClassName={classNames.join(' ')} {...this.props}>
        <img className="pb-logo__img" src={logo} alt={`${t("global.logo-of")} ${t("global.site-title")}`}/>
      </Link>
    );
  }
}

Logo.propTypes = {
  parentClassName: PropTypes.string,
  t: PropTypes.func
};


export default Logo;
