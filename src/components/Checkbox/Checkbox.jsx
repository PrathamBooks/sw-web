import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SvgIcon from '../SvgIcon';
import Loader from '../Loader';

import './Checkbox.scss';

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: false
    }
  }

  onChange = (e) => {
    const target = e.target;
    const checked = target.checked;
    const value = target.value;

    this.props.onChange({
      checked,
      value
    });
  }

  handleOnFocus = (e) => {
    this.setState({
      focus: true
    })
  }

  handleOnBlur = (e) => {
    this.setState({
      focus: false
    })
  }

  render() {
    const baseClassName = 'pb-checkbox';
    const {
      disabled,
      label,
      name,
      id,
      value,
      checked,
      loading,
      radioIcon,
      inline,
      fontWeight,
      legend
    } = this.props;

    let iconEl = <SvgIcon
                  parentClassName={`${baseClassName}__icon`}
                  name={`${radioIcon ? 'radio' : 'checkbox'}-${checked ? 'on' : 'off'}`}/>;

    if (loading) {
      iconEl = <Loader parentClassName={`${baseClassName}__loader`}/>;
    }

    let legendEl;
    if (legend) {
      legendEl = <span className={`${baseClassName}__legend`}>{legend}</span>;
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--checked`]: checked,
      [`${baseClassName}--focused`]: this.state.focus,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--inline`]: inline,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--radio-icon`]: radioIcon,
      [`${baseClassName}--font-weight--${fontWeight}`]: fontWeight,
    };

    return (
      <div className={classNames(classes)}>
        {iconEl}
        <label className={`${baseClassName}__label`} htmlFor={id}>
          {label}
          {legendEl}
          <input
            className={`${baseClassName}__input`}
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            disabled={disabled}
            onChange={this.onChange}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            value={value}
          />
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  radioIcon: PropTypes.bool,
  inline: PropTypes.bool
};

export default Checkbox;
