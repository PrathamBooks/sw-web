import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SvgIcon from '../SvgIcon';

import './RadioGroup.scss';

class RadioGroup extends Component {
  constructor(props) {
    super(props);

    if (!props.name) {
      throw new Error("'name' prop should be a string");
    }

    this.state = {
      value: props.defaultValue,
      focusedRadioIndex: -1
    };
  }

  onChange = e => {
    const target = e.target;

    if (target.checked) {
      this.setState({
        value: target.value
      });

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(target.value);
      }
    }
  }

  handleOnFocus = (index) => {
    this.setState({
      focusedRadioIndex: index
    });
  }

  handleOnBlur = () => {
    this.setState({
      focusedRadioIndex: -1
    });
  }

  render() {
    const baseClassName = 'pb-radio-group';

    const {
      name,
      id,
      radios,
      disabled,
      autoFocus
    } = this.props;

    const radioEls = radios.map((r, i) => {
      const radioClassNames = [`${baseClassName}__radio`];
      const radioId = `${id}--radio-${i}`;
      const checked = (r.value === this.state.value);

      const radioClasses = {
        [radioClassNames]: true,
        [`${baseClassName}__radio--checked`]: checked,
        [`${baseClassName}__radio--focused`]: i === this.state.focusedRadioIndex,
      };

      // TODO: Need to change onClick to onChange once the React bug
      // https://github.com/facebook/react/pull/10156 is released.
      return (
        <div className={classNames(radioClasses)} key={radioId}>
          <SvgIcon
            parentClassName={`${baseClassName}__icon`}
            name={`radio-${checked ? 'on' : 'off'}`}
            size="m" />
          <label className={`${baseClassName}__label`} htmlFor={radioId}>
            {r.label}
            <input
              className={`${baseClassName}__input`}
              type="radio"
              id={radioId}
              name={name}
              value={r.value}
              defaultChecked={checked}
              disabled={disabled}
              onClick={this.onChange}
              onBlur={e => {this.handleOnBlur(i)}}
              onFocus={e => {this.handleOnFocus(i)}}
              autoFocus={i === 0 && autoFocus}
            />
          </label>
        </div>
      );
    });

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--disabled`]: disabled
    };

    return (
      <div className={classNames(classes)}
        id={id}>
        {radioEls}
      </div>
    );
  }
}

RadioGroup.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  radios: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  defaultValue: PropTypes.any,
  autoFocus: PropTypes.bool
};

export default RadioGroup;
