import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { chunk } from 'lodash';

import './HorizontalGrid.scss';

class HorizontalGrid extends Component {
  static defaultProps = {
    cellWidth: 'm',
    rows: 1,
  }

  render() {
    const baseClassName = 'pb-horizontal-grid';

    const {
      children,
      rows,
      cellWidth
    } = this.props;

    const childrenGroupedByRow = chunk(React.Children.toArray(children), rows);

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${cellWidth}`]: cellWidth
    }

    const columnsEls = childrenGroupedByRow.map((col, i) => {
      return (
        <div className={`${baseClassName}__col`} key={`col-${i}`}>
        {
          col.map((c, i) => {
            return (
              <div className={`${baseClassName}__cell`} key={`cell-${i}`}>
                {c}
              </div>
            );
          })
        }
        </div>
      );
    });

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__wrapper`}>{columnsEls}</div>
      </div>
    );
  }
}

HorizontalGrid.propTypes = {
  children: PropTypes.node,
  rows: PropTypes.number,
  /* Default size is m */
  cellWidth: PropTypes.oneOf([
    'm',
    'l',
    'xl',
    'xxl',
    'book-card',
    'image-card',
    'category-card'
  ])
};

export default HorizontalGrid;
