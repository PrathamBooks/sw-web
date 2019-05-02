import { Component } from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

function reducePropsToState(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return {
      className: innermostProps.className,
      remove: innermostProps.remove,
    };
  }
}

function handleStateChangeOnClient(props) {
  const {
    className,
    remove
  } = props || {};

  if (className) {
    if (remove) {
      document.body.classList.remove(className);
    } else {
      document.body.classList.add(className);
    }
  }
}

class DocumentClass extends Component {
  componentWillUnmount() {
    document.body.classList.remove(this.props.className);
  }

  render() {
    return this.props.children || null;
  }
}

DocumentClass.propTypes = {
  className: PropTypes.string.isRequired,
  remove: PropTypes.bool
};

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(DocumentClass);
