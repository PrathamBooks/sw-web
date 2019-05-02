import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import Grid from '../Grid';
import SvgIcon from '../SvgIcon';

import './SelectableGrid.scss';

class SelectableGridItem extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  // Add option for all selected / deselected
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.allSelected, nextProps.allSelected)) {
      if (typeof this.props.onChange === 'function' && this.props.checked !== nextProps.allSelected) {
        this.props.onChange({
          value: nextProps.id }
        );
      }
    }
  }

  onChange(e) {
    const target = e.target;
    const value = target.id;

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        value
      });
    }
  }

  render() {
    const baseClassName = 'pb-selectable-grid-item';

    const {
      children,
      id,
      value,
      label,
      roundedCorners,
      rotateOnActive,
      theme,
      checked
    } = this.props;


    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--rounded-corners`]: roundedCorners,
      [`${baseClassName}--rotate-on-active`]: rotateOnActive,
      [`${baseClassName}--checked`]: checked,
      [`${baseClassName}--${theme}`]: theme
    };

    return (
      <div className={classNames(classes)}>
        {children}
        <div className={`${baseClassName}__wrapper`}>
          <SvgIcon
            parentClassName={`${baseClassName}__icon`}
            name={`checkbox-${checked ? 'on' : 'off'}`}
            pushRight
            size="m" />
          <label className={`${baseClassName}__label`} htmlFor={id}>
            {label}
            <input
              className={`${baseClassName}__input`}
              type="checkbox"
              id={id}
              value={value}
              onClick={this.onChange}
            />
          </label>
        </div>
      </div>
    );
  }
}

SelectableGridItem.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  rotateOnActive: PropTypes.bool,
  roundedCorners: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.string
};

class SelectableGrid extends Component {
  constructor(props) {
    super(props);

    this.checkedValues = [];

  }

  onChange = (changedItem) => {
    const value = parseInt(changedItem.value, 10);

    if (this.checkedValues.includes(value)) {
      this.checkedValues = this.checkedValues.filter(val => val !== value);
    }
    else {
      if (this.props.maxSelectAllowed) {
        if (this.checkedValues.length < this.props.maxSelectAllowed)
          this.checkedValues.push(value);
      }
      else {
        this.checkedValues.push(value);
      }
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.checkedValues);
    }
  }

  renderChildren(baseClassName) {
    const {
      children,
      rotateOnActive,
      roundedCorners,
      label,
      theme,
      allSelected
    } = this.props;

    return React.Children.toArray(children)
      .map((child, i) => {
        return <SelectableGridItem
          id={child.props.id}
          key={i}
          label={label}
          rotateOnActive={rotateOnActive}
          roundedCorners={roundedCorners}
          theme={theme}
          value={child.props.value}
          onChange={this.onChange}
          allSelected={allSelected}
          checked={this.checkedValues.includes(parseInt(child.props.id, 10))}
          >
          {child}
        </SelectableGridItem>
      });
  }

  componentWillReceiveProps(nextProps) {
    //filter out the checked values which are no longer included in the children
    if (!isEqual(this.props.children, nextProps.children)) {
      const availableValues = nextProps.children.map(child => {  return parseInt(child.props.id, 10)  });
      this.checkedValues = this.checkedValues.filter(val => availableValues.includes(val));

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.checkedValues);
      }
    }
  }

  render() {
    const baseClassName = 'pb-selectable-grid';
    const {
      variant
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${variant}`]: variant
    };

    return (
      <div className={classNames(classes)}>
        <Grid variant={variant}>
          {this.renderChildren(baseClassName)}
        </Grid>
      </div>
    );
  }
}

SelectableGrid.propTypes = {
  children: PropTypes.node,
  variant: Grid.propTypes.variant,
  id: PropTypes.string.isRequired,
  rotateOnActive: PropTypes.bool,
  roundedCorners: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.string
};

export default SelectableGrid;
