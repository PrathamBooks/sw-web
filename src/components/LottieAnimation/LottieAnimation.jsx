import React, { Component } from 'react';
import classNames from 'classnames';

import { translate } from 'react-polyglot';
import { animationTypes } from '../../lib/constants';


import Lottie from 'react-lottie';
import * as likeAnimationData from '../../lib/like.json';
import * as okayAnimationData from '../../lib/okay.json';
import * as loveAnimationData from '../../lib/love.json';


import './LottieAnimation.scss';


@translate()
class LottieAnimation extends Component {
	static defaultProps = {
		type: animationTypes.okay
	}
  
  onClick = () => {
    this.props.onClick(this.props.type);
  }
  
  
  render() {
		const baseClassName = 'pb-lottie-animation';

		const {
			type,
			isSelected
      } = this.props;
      
      const classes = {
        [baseClassName]: true,
        [`${baseClassName}--selected`]: isSelected,
      };

    let animationData = null
    if (type === animationTypes.okay) {
      animationData = okayAnimationData
    }
    else if (type === animationTypes.like) {
      animationData = likeAnimationData
    }
    else {
      animationData = loveAnimationData
    }
      

    const defaultOptions = {
      loop: true,
      autoplay: false, 
      animationData: animationData,
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: false,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
        className: `${baseClassName}__animation`
      }
    };

    return (
      <div className={classNames(classes)} onClick={this.onClick}>
        <Lottie options={defaultOptions}
          isPaused={!isSelected}
        />
      </div>
    );
  }
}

export default LottieAnimation;
