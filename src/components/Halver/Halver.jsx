import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Halver.scss';

class Halver extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-halver';
    const {
      parentClassName,
      backgroundUrl,
      children
    } = this.props;

    const styles = {};
    if (backgroundUrl) {
      styles.backgroundImage = `url('${backgroundUrl}')`;
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)} style={styles}>
        <div className={`${baseClassName}__content`}>{children}</div>
      </div>
    );
  }
}

Halver.propTypes = {
  children: PropTypes.object.isRequired,
  parentClassName: PropTypes.string,
  backgroundUrl: PropTypes.string
};

export default Halver;
