import React, { Component } from 'react';
import PropTypes from 'prop-types';

const requireSvgs = require.context('./svgs/', false, /\.svg$/)
const svgObjects = {};

requireSvgs.keys().forEach(s => {
  svgObjects[s.replace(/\.svg$/,"").replace(/^\.\//,"")] = requireSvgs(s).default;
});

class SvgSymbol extends Component {
  static defaultProps = {
    includeViewBox: false
  }

  render() {
    let el = null;

    if (svgObjects[this.props.name] != null) {
      el = (
        <svg className={this.props.parentClassName} viewBox={this.props.includeViewBox ? `${svgObjects[this.props.name].viewBox}` : null }>
          <use xlinkHref={`#${svgObjects[this.props.name].id}`} />
        </svg>
      );
    }
    return el;
  }
}

SvgSymbol.propTypes = {
  /* The name should match the file name of svg (without.svg) */
  name: PropTypes.string.isRequired,
  parentClassName: PropTypes.string,
  includeViewBox: PropTypes.bool,
};

export default SvgSymbol;
