import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import Caret from '../Caret';
import Loader from '../Loader';
import Picklist from '../Picklist';

import './SearchableSelectField.scss';

@onClickOutside
class SearchableSelectField extends Component {
  // static defaultProps = {}
  constructor(props) {
    super(props);

    this.state = {
      optionOnEmpty: null,
      isFocused: false,
      isDirty: false,
      isTouched: false,
      searchValue: undefined,
      open: false,
      checkedValues: props.value ? [ props.value ] : [],
      currentOption: null
    };
  }

  componentDidMount() {
    if (this.props.options) {
      const optionOnEmpty = this.props.options.find(o => {
        return o.queryValue === '';
      });

      if (optionOnEmpty) {
        this.setState({
          optionOnEmpty: optionOnEmpty.name
        });
      }

      if ( !this.state.currentOption ) {
        // filter default name from list of options recieved from API
        const currentOptionObject = this.props.options.find( o => o.queryValue === this.props.value );
        if (currentOptionObject) {
          this.setState({ currentOption: currentOptionObject.name });
        }
      }
    }
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
      
      if ( !this.state.currentOption ) {
        // filter default name from list of options recieved from API
        const currentOptionObject = nextProps.options.find( o => o.queryValue === nextProps.value );
        if (currentOptionObject) {
          this.setState({ currentOption: currentOptionObject.name });
        }
      }
    }

    if (nextProps.disabled || nextProps.loading) {
      this.hidePicklist();
    }
  }

  handleChange = (value, checked) => {
    const currentOption = this.props.options.find(o => o.queryValue === value)
    if (checked) {
      this.setState({
        checkedValues: [value],
        isDirty: true,
        currentOption: (currentOption && currentOption.name && currentOption.name !== '' ) ? currentOption.name : null
      });

      if (this.props.onChange) {
        this.props.onChange(value, currentOption);
      }
    }

    this.hidePicklist();
  }

  handleOnBlur = e => {
    this.setState({isFocused: false, isTouched: true});
  }

  handleOnFocus = e => {
    this.setState({isFocused: true});
  }

  handleSearchChange = (e) => {
    if (e.target.value !== this.state.searchValue) {
      this.setState({
        searchValue: e.target.value
      })
    }

    if (this.props.onSearchChange) {
      this.props.onSearchChange(e.target.value)
    }
  }

  showPicklist = () => {
    this.setState({
      open: true
    })
  }

  hidePicklist = () => {
    this.setState({
      open: false
    })
  }

  togglePicklist = () => {
    if (this.state.open) {
      this.hidePicklist();
    } else {
      this.showPicklist();
    }
  }

  handleClickOutside = e => {
    if (this.state.open) {
      this.hidePicklist();
    }
  }

  render() {
    const baseClassName = 'pb-searchable-select-field';
    const {
      parentClassName,
      value,
      label,
      id,
      loading,
      options,
      disabled,
      height,
      error,
      autoFocus
    } = this.props;

    const filteredOptions = options.filter(o => !(o.name === '' || o.name === null));

    let labelEl;
    if (label) {
      labelEl = <label className={`${baseClassName}__label`} htmlFor={id}>{label}</label>;
    }

    let iconEl = <Caret parentClassName={`${baseClassName}__caret`} direction="down" />
    if (loading) {
      iconEl = <Loader parentClassName={`${baseClassName}__loader`} size="m"/>
    }



    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--blank`]: !value && (this.state.optionOnEmpty === '' || this.state.optionOnEmpty === null),
      [`${baseClassName}--height-${height}`]: height,
      [`${baseClassName}--focused`]: this.state.isFocused,
      [`${baseClassName}--error`]: this.state.isDirty ? error : null,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--loading`]: loading,
      [parentClassName]: parentClassName,
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__wrapper`}>
          <div className={`${baseClassName}__box`} />
          <div className={`${baseClassName}__icon-wrapper`}>{iconEl}</div>
          {labelEl}
          <button
            role="listbox"
            id={id}
            className={`${baseClassName}__control`}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
            onClick={this.togglePicklist}
            tabindex="0"
            disabled={disabled || loading}
            >
            {this.state.currentOption}
          </button>
          {
            this.state.open
            ?
            <div className={`${baseClassName}__picklist`}>
              <Picklist
                multiplePicks={false}
                options={filteredOptions}
                checkedValues={this.state.checkedValues}
                searchValue={this.state.searchValue}
                onSearchChange={this.handleSearchChange}
                onChange={this.handleChange}
                fitToContainer
                autoFocus={autoFocus}
                />
            </div>
            :
            null
          }
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

SearchableSelectField.propTypes = {
  parentClassName: PropTypes.string,
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
  height: PropTypes.oneOf(['m', 's']),
  error: PropTypes.string,
  onSearchChange: PropTypes.func,
  autoFocus: PropTypes.bool
};

export default SearchableSelectField;
