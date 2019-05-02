import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import './Hr.scss';

@translate()
class Hr extends Component {
  render() {
    const baseClassName = 'pb-hr';
    const {
      parentClassName,
      label,
      t
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__label`}>{label ? label : t("global.or")}</div>
      </div>
    );
  }
}

Hr.propTypes = {
  parentClassName: PropTypes.string,
  label: PropTypes.string
};

export default Hr;
