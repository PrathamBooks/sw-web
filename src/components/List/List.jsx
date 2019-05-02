import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './List.scss';

class List extends Component {
  static defaultProps = {}

  render() {
  const baseClassName = 'pb-list';
  const {
    children,
    inline,
    nowrap,
    parentClassName,
    separator,
    alignLeft
  } = this.props;

  const itemEls = [];
  const separatorEl = <span className={`${baseClassName}__separator`}>{separator}</span>;

  if (children && children.length && (typeof children !== 'string')) {
    React.Children
      .toArray(children)
      .forEach((c, i, a) => {
        if (c == null) {
          return;
        }

        itemEls.push(
          <li key={i}>
            {c}
            {
              inline && separator && (i !== (a.length - 1))
              ?
              separatorEl
              :
              null
            }
          </li>
        );
      });
  } else {
    itemEls.push(<li key="1">{children}</li>);
  }

  const classes = {
    [baseClassName]: true,
    [parentClassName]: parentClassName,
    [`${baseClassName}--align-left`]: alignLeft,
    [`${baseClassName}--inline`]: inline,
    [`${baseClassName}--nowrap`]: nowrap,
    [`${baseClassName}--separated`]: inline && separator
  }

  return (
    <ul className={classNames(classes)}>
      {itemEls}
    </ul>
  );
}
}

List.propTypes = {
  children: PropTypes.node.isRequired,
  inline: PropTypes.bool,
  nowrap: PropTypes.bool,
  separator: PropTypes.string,
  parentClassName: PropTypes.string,
};

export default List;
