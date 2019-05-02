import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Caret from '../Caret';
import Loader from '../Loader';

import './SelectField.scss';

class SelectField extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);

    this.state = {
      optionOnEmpty: null,
      isFocused: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options) {
      const optionOnEmpty = nextProps.options.find(o => {
        return o.queryValue === '';
      });

      if (optionOnEmpty) {
        this.setState({
          optionOnEmpty: optionOnEmpty.name
        });
      }
    }
  }

  handleOnBlur = e => {
    this.setState({isFocused: false});
  }

  handleOnFocus = e => {
    this.setState({isFocused: true});
  }

  handleOnChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    const baseClassName = 'pb-select-field';

    const {
      id,
      disabled,
      loading,
      label,
      name,
      value,
      options,
      theme,
      formField,
      error,
      parentClassName
    } = this.props;

    let labelEl;
    if (this.props.label) {
      labelEl = <label className={`${baseClassName}__label`} htmlFor={id}>{label}</label>;
    }

    let iconEl = <Caret parentClassName={`${baseClassName}__caret`} direction="down" />
    if (loading) {
      iconEl = <Loader parentClassName={`${baseClassName}__loader`} size="m"/>
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--label`]: label,
      [`${baseClassName}--focus`]: this.state.isFocused,
      [`${baseClassName}--blank`]: !value && (this.state.optionOnEmpty === '' || this.state.optionOnEmpty === null),
      [`${baseClassName}--theme-${theme}`]: theme,
      [`${baseClassName}--disabled`]: disabled,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--form-field`]: formField,
      [`${baseClassName}--error`]: error,
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__input-wrapper`}>
          <div className={`${baseClassName}__box`}></div>
          <div className={`${baseClassName}__icon-wrapper`}>{iconEl}</div>
          {labelEl}
          <select
            id={id}
            value={value}
            ref="selectEl"
            className={`${baseClassName}__input`}
            onChange={this.handleOnChange}
            disabled={disabled || loading}
            name={name}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
          >
            {
              options.map((option, index) => (
                <option
                  key={index}
                  value={option.queryValue}
                >
                  {option.name}
                </option>
              ))
            }
          </select>
        </div>
        {
          error
          ?
          <div className={`${baseClassName}__error-text`}>{error}</div>
          :
          null
        }
      </div>
    );
  }
}

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    queryValue: PropTypes.string.isRequired
  })),
  onChange: PropTypes.func,
  theme: PropTypes.oneOf(['default', 'light']),
  error: PropTypes.string,
};

export default SelectField;
