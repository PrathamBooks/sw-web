import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../Link';

import './Tabs.scss';

class Tabs extends Component {
  static defaultProps = {
    align: 'center'
  }

  constructor(props) {
    super(props);
    
    const firstNonEmptyTab = React.Children.toArray(props.children).findIndex(child => child.props.hasContent);

    let currentTab = props.activeTabIndex || 0;
    if (firstNonEmptyTab !== -1) {
      currentTab = firstNonEmptyTab;
    }

    this.state = {
      currentTab
    };
  }

  goToTab = (index) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(index);
    }

    this.setState({
      currentTab: index
    });
  }

  render() {
    const baseClassName = 'pb-tabs';

    const {
      children,
      align,
      fitHeight
    } = this.props;

    const childrenArray = React.Children.toArray(children).map((child, index) => {
      if (index === this.state.currentTab) {
        return React.cloneElement(child, {
          active: true
        });
      }

      return child;
    });

    const titles = childrenArray.map((child, index) => {
      const linkClassNames = [`${baseClassName}__tab-link`];

      if (index === this.state.currentTab) {
        linkClassNames.push(`${baseClassName}__tab-link--active`);
      }

      return (
        <Link parentClassName={linkClassNames.join(' ')} disabled={child.props.disabled} key={index} onClick={() => this.goToTab(index)}>{child.props.title}</Link>
      )
    });

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--align-${align}`]: align,
      [`${baseClassName}--fit-height`]: fitHeight
    }

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__tabs`}>{titles}</div>
        {childrenArray}
      </div>
    );
  }
}

Tabs.propTypes = {
  parentClassName: PropTypes.string,
  fitHeight: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center']),
  onTabChange: PropTypes.func
};

export default Tabs;
