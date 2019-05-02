import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import Link from '../Link';

import './Shrinker.scss';

@translate()
class Shrinker extends Component {
  static defaultProps = {
    disabled: false
  }

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.disabled) {
      this.setState({
        isExpanded: false,
      });
    }
  }

  toggle(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  render() {
    const baseClassName = 'pb-shrinker';
    const classNames = [baseClassName];
    const { t, children, disabled } = this.props;
    const { isExpanded } = this.state;

    let toggleEl;
    if (!disabled) {
      if (!isExpanded) {
        classNames.push(`${baseClassName}--shrunk`)
      }

      toggleEl = (
        <div className={`${baseClassName}__toggle`} onClick={isExpanded ? null : this.toggle}>
          <Link parentClassName={`${baseClassName}__toggle-link`} onClick={this.toggle}>
            {
              isExpanded
              ?
              t("Shrinker.view-less")
              :
              t("Shrinker.view-more")
            }
          </Link>
        </div>
      );
    }

    return (
      <div className={classNames.join(' ')}>
        {children}
        {toggleEl}
      </div>
    );
  }
}

Shrinker.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  t: PropTypes.func
};

export default Shrinker;
