import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { keyCodes } from '../../lib/constants';

import Link from '../Link';
import ListBox from '../ListBox';
import SvgIcon from '../SvgIcon';

import { translate } from 'react-polyglot';
import './TextField.scss';

const ListBoxEl = ({
  baseClassName,
  options,
  selectedIndex,
  onSelect
}) => {
  if (options && options.length) {
    return (
      <div className={`${baseClassName}__options`}>
        <ListBox
          options={options}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          />
      </div>
    );
  }

  return null;
};

/**
 * Check if a value is valid to be displayed inside an input.
 *
 * @param The value to check.
 * @returns True if the string provided is valid, false otherwise.
 */
function isValid(value) {
  return value !== '' && value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);
}

@translate()
class TextField extends Component {
  static defaultProps = {
    type: 'text',
    rows: 4,
    size: 'm',
    theme: 'default'
  }

  constructor(props) {
    super(props);

    this.inputEl = undefined;

    this.state = {
      hasValue: false,
      isFocused: false,
      isDirty: false,
      isTouched: false,
      options: this.getOptions(props.options, props.value),
      optionsSelectIndex: undefined
    }
  }

  getOptions(options, value) {
    if (options && options.length && value && value.length > 0) {
      const filteredOptions = this.filterOptionsByQuery(options, value);

      if ((filteredOptions && filteredOptions.length) &&
        !(filteredOptions.length === 1 && filteredOptions[0] === value)) {
        return filteredOptions;
      }
    }

    return null;
  }

  componentWillMount() {
    this.setState({
      hasValue: isValid(this.props.value) || isValid(this.props.defaultValue),
    });
  }

  componentDidMount() {
    this.inputEl.addEventListener('keydown', this.onKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('value')) {
      const hasValue = isValid(nextProps.value);

      this.setState({
        hasValue: hasValue
      });

      if (nextProps.hasOwnProperty('options')) {
        this.setState({
          options: this.getOptions(nextProps.options, nextProps.value),
          optionsSelectIndex: undefined
        });
      }
    }
  }

  componentWillUnmount() {
    this.inputEl.removeEventListener('keydown', this.onKeyDown);
  }


  filterOptionsByQuery(options, query) {
    return options.filter((s) => {
      return s.toLowerCase().indexOf(query.toLowerCase()) === 0;
    });
  }

  focus = () => {
    if (this.inputEl) {
      this.inputEl.focus();
    }
  }

  processOptionSelection = (value) => {
    if (this.props.onOptionSelect) {
      this.props.onOptionSelect(value);
    }
  }

  selectNext = () => {
    if (this.state.options) {
      let newSelection;
      if (this.state.optionsSelectIndex === undefined) {
        newSelection = 0;
      } else if (this.state.optionsSelectIndex + 1 < this.state.options.length) {
        newSelection = this.state.optionsSelectIndex + 1;
      } else {
        newSelection = this.state.options.length - 1;
      }

      if (newSelection !== undefined) {
        this.setState({optionsSelectIndex: newSelection});
      }
    }
  }

  selectPrevious = () => {
    let newSelection;

    if (this.state.optionsSelectIndex !== undefined && (this.state.optionsSelectIndex - 1 !== -1)) {
      newSelection = this.state.optionsSelectIndex - 1;
    } else {
      newSelection = 0;
    }

    if (newSelection  !== undefined) {
      this.setState({optionsSelectIndex: newSelection});
    }
  };

  onKeyDown = (e) => {
    if (this.state.options) {
      if (e.keyCode === keyCodes.upArrow) {
        this.selectPrevious();
        e.preventDefault();
      } else if (e.keyCode === keyCodes.downArrow) {
        this.selectNext();
        e.preventDefault();
      } else if (e.keyCode === keyCodes.return) {
        this.processOptionSelection(this.state.options[this.state.optionsSelectIndex]);
        e.preventDefault();
      }
    }
  };

  handleOnBlur = (e) => {
    this.setState({isFocused: false, isTouched: true});

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  handleOnChange = (e) => {
    this.setState({hasValue: isValid(e.target.value), isDirty: true});

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleOnFocus = (e) => {
    this.setState({isFocused: true});

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleListBoxSelect = (value) => {
    this.focus();
    this.processOptionSelection(value);
  }

  render() {
    const baseClassName = 'pb-text-field';
    const inputClassNames = [`${baseClassName}__input`];

    const {
      t,
      disabled,
      fontFamily,
      icon,
      id,
      label,
      maxLength,
      parentClassName,
      rows,
      size,
      theme,
      type,
      value,
      error,
      onIconClick,
      name,
      autoFocus,
      min,
      placeholder
    } = this.props;

    let inputProps = {
      onChange: this.handleOnChange,
      onFocus: this.handleOnFocus,
      onBlur: this.handleOnBlur,
      onKeyPress: this.props.onKeyPress,
      defaultValue: this.props.defaultValue,
      disabled: disabled,
      name: name,
      min: min
    };
    
    // This will take care of null and undefined values, 
    // so empty string '' will not be treated as false,
    // if we use 'if (value)' instead
    if (value != null) {
      inputProps.value = value;
    }

    let labelEl;
    if (label) {
      labelEl = <label className={`${baseClassName}__label`} htmlFor={id}>{label}</label>;
    }

    let inputEl;
    if (type === 'multiline') {
      inputEl = <textarea
          ref={inputEl => this.inputEl = inputEl}
          className={inputClassNames.join(' ')}
          id={id}
          autoFocus={autoFocus}
          {...inputProps}
          rows={rows}
          maxLength={maxLength}
        />;
    }

    else if (type === 'file') {
      inputEl = <div className={`${baseClassName}__upload_file`}>
                  <input
                    placeholder={name||placeholder||t('illustrationUpload.jpeg-png')}
                    className={`${baseClassName}__file-input`}
                    disabled={true}
                    maxLength={maxLength}
                  />
                  <div className={`${baseClassName}__browse_file`}>
                    <label htmlFor={id} className={`${baseClassName}__browse_file_label`}>Browse</label>
                    <input
                      className={`${baseClassName}__browse`}
                      type={type}
                      id={id}
                      autoFocus={autoFocus}
                      ref={inputEl => this.inputEl = inputEl}
                      {...inputProps}
                    />
                  </div>
                  
                </div>
    }
    
    else {
      inputEl = <input
        className={inputClassNames.join(' ')}
        type={type}
        id={id}
        maxLength={maxLength}
        ref={inputEl => this.inputEl = inputEl}
        autoFocus={autoFocus}
        {...inputProps}
      />
    }

    let iconEl;
    if (icon) {
      iconEl = (
        <Link
          parentClassName={`${baseClassName}__icon-wrapper`}
          onClick={onIconClick}
          disabled={disabled || !onIconClick}
          tabIndex={onIconClick ? "0" : "-1"}
          >
          <SvgIcon parentClassName={`${baseClassName}__icon`} size={size} name={icon} />
        </Link>
      );
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--theme-${theme}`]: theme,
      [`${baseClassName}--blank`]: !this.state.isFocused && !this.state.hasValue,
      [`${baseClassName}--focus`]: this.state.isFocused,
      [`${baseClassName}--icon`]: icon,
      [`${baseClassName}--${type}`]: type,
      [`${baseClassName}--${size}`]: size,
      [`${baseClassName}--font-family-${fontFamily}`]: fontFamily,
      [`${baseClassName}--error`]: this.state.isDirty ? error : null,
      [`${baseClassName}--disabled`]: disabled,
      [parentClassName]: parentClassName
    }

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__input-wrapper`}>
          <div className={`${baseClassName}__box`}></div>
          {labelEl}
          {inputEl}
          {iconEl}
          <ListBoxEl
            baseClassName={baseClassName}
            options={this.state.options}
            onSelect={this.handleListBoxSelect}
            selectedIndex={this.state.optionsSelectIndex}
            />
        </div>
        {
          error && this.state.isDirty
          ?
          <div className={`${baseClassName}__error-text`}>{error}</div>
          :
          null
        }
      </div>
    );
  }
}

TextField.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  fontFamily: PropTypes.oneOf(['default', 'alt', 'monospace']),
  icon: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  parentClassName: PropTypes.string,
  row: PropTypes.number,
  size: PropTypes.oneOf(['m', 'l']),
  theme: PropTypes.oneOf(['default', 'light', 'dark']),
  type: PropTypes.oneOf(['text', 'email', 'password', 'multiline', 'number', 'tel']),
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  onOptionSelect: PropTypes.func,
  onIconClick: PropTypes.func,
  autoFocus: PropTypes.bool
};

export default TextField;
