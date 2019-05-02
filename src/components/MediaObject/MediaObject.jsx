import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MediaObject.scss';

const baseClassName = 'pb-media-object';

export class MediaObject extends Component {
  static defaultProps = {}

  render() {
    const {fitToMedia} = this.props;

    const classes = {
      [baseClassName]: true ,
      [`${baseClassName}--fit-to-media`]: fitToMedia,
    }
    return (<div className={classNames(classes)}>{this.props.children}</div>);
  }
}

MediaObject.propTypes = {
  children: PropTypes.node.isRequired
};

export class Body extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-media-object__body';
    const classNames = [baseClassName];

    return (<div className={classNames.join(' ')}>{this.props.children}</div>);
  }
}

Body.propTypes = {
  children: PropTypes.node.isRequired
};

export class Media extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-media-object__media';
    const classNames = [baseClassName];

    return (<div className={classNames.join(' ')}>{this.props.children}</div>);
  }
}

Media.propTypes = {
  children: PropTypes.node.isRequired
};
