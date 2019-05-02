import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './{{ name }}.scss';

class {{ name }} extends Component {
  // static defaultProps = {}

  render() {
    const baseClassName = 'pb-{{ camelCaseToDashCase name }}';
    const {
      parentClassName
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        {{ name }}
      </div>
    );
  }
}

{{ name }}.propTypes = {
  parentClassName: PropTypes.string
};

export default {{ name }};
