import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import TextField from '../TextField';
import Checkbox from '../Checkbox';
import Link from '../Link';

import './Picklist.scss';

@translate()
class Picklist extends Component {
  static defaultProps = {
    checkedValues: [],
    multiplePicks: true
  }

  constructor(props) {
    super(props);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  handleCheckBoxChange({ checked, value }) {
    if (this.props.onChange) {
      this.props.onChange(value, checked);
    }
  }

  isValueChecked = (value) => {
    const {
      checkedValues,
      multiplePicks
    } = this.props;

    let values = checkedValues;

    // While using single pick (radio) pick the last value from the checkedValues
    if (!multiplePicks && checkedValues && Array.isArray(checkedValues)) {
      values = checkedValues[checkedValues.length - 1];
    }

    if (values && Array.isArray(values)) {
      return values.includes(value)
    } else if (values) {
      return value === values
    }

    return false;
  }

  render() {
    const baseClassName = 'pb-picklist';

    const {
      t,
      id,
      options,
      searchValue,
      onSearchChange,
      onClear,
      fitToContainer,
      sortByChecked,
      multiplePicks,
      autoFocus,
      hideSearchBar,
      fontWeight,
      disabled
    } = this.props;

    let filteredOptions;

    if (searchValue !== '' && typeof searchValue !== 'undefined') {
      filteredOptions = options.filter(option => {
        return String(option.queryValue).toLowerCase().includes(searchValue.toLowerCase());
      })
    } else {
      filteredOptions = options;
    }

    if (sortByChecked) {
      filteredOptions = sortBy(filteredOptions, [
        (c => !this.isValueChecked(c.queryValue)),
        'name'
      ]);
    }

    const checkboxEls = filteredOptions.map((c, i) => {
      return (
        <Checkbox
          key={`${id}-checkbox-${i}`}
          id={`${id}-checkbox-${i}`}
          label={c.name}
          value={c.queryValue}
          legend={c.legend}
          checked={this.isValueChecked(c.queryValue)}
          onChange={this.handleCheckBoxChange}
          radioIcon={!multiplePicks}
          fontWeight={fontWeight}
          disabled={disabled}
        />
      )
    });

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--clearable`]: onClear,
      [`${baseClassName}--fit-to-container`]: fitToContainer,
    }

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__header`}>
          {
            hideSearchBar
            ?
            null
            :
            <TextField
              disabled={disabled}
              id={`${id}-search-field`}
              type="text"
              label={t("global.search")}
              value={searchValue}
              onChange={onSearchChange}
              autoFocus={autoFocus}
              icon="search" 
            />
          }
          {
            onClear
            ?
            <div className={`${baseClassName}__clear-trigger`}>
              <Link onClick={onClear}>{t("Picklist.clear-all")}</Link>
            </div>
            :
            null
          }
        </div>
        <div className={`${baseClassName}__options`}>
          {checkboxEls}
        </div>
      </div>
    );
  }
}

Picklist.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    queryValue: PropTypes.string.isRequired
  })),
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  fitToContainer: PropTypes.bool,
  checkedValues: PropTypes.oneOfType(
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ),
  sortByChecked: PropTypes.bool,
  multiplePicks: PropTypes.bool,
  autoFocus: PropTypes.bool
};

export default Picklist;
