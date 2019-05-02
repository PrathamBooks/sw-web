import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Button from '../Button';

import './Pagination.scss';

@translate()
class Pagination extends Component {
  render() {
    const baseClassName = 'pb-pagination';
    const classNames = [baseClassName];

    const {
      t,
      label,
      onClick,
      loading
    } = this.props;

    let labelText = label;
    if (!labelText) {
      labelText = t("Pagination.load-more");
    }

    return (
      <div className={classNames.join(' ')}>
        <Button
          iconLeft="refresh"
          loading={loading}
          label={labelText}
          onClick={onClick} />
      </div>
    );
  }
}

Pagination.propTypes = {
  t: PropTypes.func,
  label: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool
};

export default Pagination;
