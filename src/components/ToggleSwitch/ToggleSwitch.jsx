import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './ToggleSwitch.scss';

class ToggleSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      on: props.defaultOn
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const checked = e.target.checked;

    this.setState({
      on: checked
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(checked);
    }
  }

  render() {
    const baseClassName = 'pb-toggle-switch';
    const classNames = [baseClassName];

    const {
      id,
      onLabel,
      offLabel,
      name,
      disabled
    } = this.props;

    classNames.push(`${baseClassName}--${this.state.on ? 'on' : 'off'}`);

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__groove`}>
          <div className={`${baseClassName}__knob`}></div>
        </div>
        <label className={`${baseClassName}__label`} htmlFor={id}>
          <span className={`${baseClassName}__off-label`}>{offLabel}</span>
          <span className={`${baseClassName}__on-label`}>{onLabel}</span>
          <input
            className={`${baseClassName}__input`}
            type="checkbox"
            id={id}
            name={name}
            defaultChecked={this.state.checked}
            disabled={disabled}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  defaultOn: PropTypes.bool
};

export default ToggleSwitch;
