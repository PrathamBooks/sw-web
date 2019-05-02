import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Columnizer from '../Columnizer';
import Stat from '../Stat';
import './StatsBar.scss';

class StatsBar extends Component {

  render() {
    const baseClassName = 'pb-stats-bar';
    const {
      parentClassName,
      stats
    } = this.props;

    if (!stats || stats.length === 0) {
      return null;
    }

    let statEls = stats.map((stat, i) => {
      return <Stat
        key={`${baseClassName}__stat-${i}`}
        parentClassName={`${baseClassName}__stat`}
        label={stat.label}
        value={stat.value}
        variant="accent-values"
        align="center"
        size="l"
        />
    });

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__container`}>
          <Columnizer columns={statEls.length >= 3 ? 3 : statEls.length}>
            {statEls}
          </Columnizer>
        </div>
      </div>
    );
  }
}

StatsBar.propTypes = {
  parentClassName: PropTypes.string,
  stats: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string
  })).isRequired
};

export default StatsBar;
