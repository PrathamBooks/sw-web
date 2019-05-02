import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Columnizer.scss';

class Columnizer extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-columnizer';
    const {
      parentClassName,
      noGutter
    } = this.props;

    const columnEls = [];

    if (this.props.children && this.props.children.length && (typeof this.props.children !== 'string')) {
      React.Children.forEach(this.props.children, (c, i) => {
        const styles = {
          width: '100%'
        };

        if (Array.isArray(this.props.columns)) {
          styles.width = this.props.columns[i % this.props.columns.length]
          if ((i % this.props.columns.length) === 0) {
            styles.clear = 'left';
          }
        } else if (typeof this.props.columns === 'number') {
          styles.width = `${100 / this.props.columns}%`
        } else {
          styles.width = `${100 / this.props.children.length}%`
        }

        columnEls.push(
          <div
            key={i}
            className="pb-columnizer__column"
            style={styles}
          >
            {c}
          </div>
        );
      });
    } else {
      const styles = {
        width: '100%'
      };

      columnEls.push(
        <div
          key="1"
          className="pb-columnizer__column"
          style={styles}
        >
          {this.props.children}
        </div>
      );
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--no-gutter`]: noGutter
    }

    return (
      <div className={classNames(classes)}>
        {columnEls}
      </div>
    );
  };
}

Columnizer.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number
  ]),
  parentClassName: PropTypes.string,
  noGutter: PropTypes.bool,
};

export default Columnizer;
