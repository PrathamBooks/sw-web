import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import './ListBox.scss';

// eslint-disable-next-line no-script-url
const noopStr = 'javascript:;';

class ListBox extends Component {
  constructor(props) {
    super(props);

    this.selectedItemRef = undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedIndex !== prevProps.selectedIndex && this.selectedItemRef) {
      scrollIntoViewIfNeeded(this.selectedItemRef, false);
    }
  }

  onClickHandler = (value) => {
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  }

  render() {
    const baseClassName = 'pb-list-box';
    const {
      parentClassName,
      options,
      selectedIndex
    } = this.props;

    const itemEls = options.map((option, i) => {
      const itemClasses = {
        [`${baseClassName}__item`]: true,
        [`${baseClassName}__item--selected`]: i === selectedIndex
      };

      return <a
        ref={i === selectedIndex ? (r) => {this.selectedItemRef = r} : null}
        key={`${baseClassName}__item--${i}`}
        className={classNames(itemClasses)}
        onClick={() => this.onClickHandler(option)}
        href={noopStr}
        >
          {option}
      </a>;
    });

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__list`}>
          {itemEls}
        </div>
      </div>
    );
  }
}

ListBox.propTypes = {
  parentClassName: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  selectedIndex: PropTypes.number,
  onSelect: PropTypes.func
};

export default ListBox;
