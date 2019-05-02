import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import './Dropdown.scss';

@onClickOutside
class Dropdown extends Component {
  static defaultProps = {
    align: 'right',
    minWidth: 'm'
  }

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.debounce = this.debounce.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.disabled) {
      this.setState({
        isDropdownOpen: false
      });
    }
  }
  toggleDropdown(e) {
    e.preventDefault();
     
    if (this.props.disabled) {
      return;
    }

    if (this.state.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.setState({
      isDropdownOpen: true
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  closeDropdown() {
    this.setState({
      isDropdownOpen: false
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  
  handleClickOutside = e => {
    if (this.state.isDropdownOpen) {
      this.closeDropdown();
    }
  }
  // debounce function limits the rate at which a function can fire. Wrapper function, which  restricts the repetitive call of the returned function  within a specified instant.
  // adding the link https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  
  debounce = (func, delay) => {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
  }
  render() {
    const baseClassName = 'pb-dropdown';
    const baseTransitionDuration = 100;
    const {
      children,
      parentClassName,
      toggleClassName,
      align,
      toggleEl,
      noPadding,
      disabled,
      minWidth
    } = this.props;

    let dropdownListEl;
    if (this.state.isDropdownOpen) {
      dropdownListEl = (
        <CSSTransition
          key={`pb-dropdown__content`}
          classNames={`${baseClassName}__contents`}
          timeout={baseTransitionDuration}>
          <div className={`${baseClassName}__contents`}>{children}</div>
        </CSSTransition>
      );
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--open`]: this.state.isDropdownOpen,
      [parentClassName]: parentClassName,
      [`${baseClassName}--align-${align}`]: align,
      [`${baseClassName}--min-width-${minWidth}`]: minWidth,
      [`${baseClassName}--no-padding`]: noPadding
    };

    const toggleElClassNames = {
      [`${baseClassName}__toggle`]: true,
      [toggleClassName]: toggleClassName
    }
    const debounceToggleDropdown = this.debounce(this.toggleDropdown, 200);
    return (
      <div className={classNames(classes)}>
        <div className={classNames(toggleElClassNames)} onClick={debounceToggleDropdown} onFocus={debounceToggleDropdown}>
          {React.cloneElement(toggleEl, {disabled})}
        </div>
        <TransitionGroup>
          {dropdownListEl}
        </TransitionGroup>
      </div>
    );
  }
}

Dropdown.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  toggleEl: PropTypes.node.isRequired,
  parentClassName: PropTypes.string,
  toggleClassName: PropTypes.string,
  noPadding: PropTypes.bool,
  /* Default minWidth is 'm' */
  minWidth: PropTypes.oneOf([
    'm',
    'l',
    'xl',
    'xxl',
    'auto'
  ]),
  /* Default align is 'right' */
  align: PropTypes.oneOf([
    'right',
    'left'
  ]),
  disabled: PropTypes.bool
};

export default Dropdown;
