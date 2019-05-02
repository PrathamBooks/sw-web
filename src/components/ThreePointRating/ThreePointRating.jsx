import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import { animationTypes } from '../../lib/constants';
import LottieAnimation from '../LottieAnimation';

import './ThreePointRating.scss';


class ThreePointRating extends Component {  
    constructor(props) {
      super(props);
  
      this.state = {
        selectedSmiley: null
      };
    }

    onSelect = (type) => {
      this.setState({ selectedSmiley: type })

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(type);
      }
    }


  render () {

    const { t } = this.props;

    const baseClassName = 'pb-three-point-rating';

    return (
      <div className={`${baseClassName}`}>
        <LottieAnimation
          type={animationTypes.okay}
          t={t}
          isSelected={this.state.selectedSmiley === animationTypes.okay}
          onClick={this.onSelect.bind(this, animationTypes.okay)}
        />
        <LottieAnimation
          type={animationTypes.like}
          t={t}
          isSelected={this.state.selectedSmiley === animationTypes.like}
          onClick={this.onSelect.bind(this, animationTypes.like)}
        />
        <LottieAnimation
          type={animationTypes.love}
          t={t}
          isSelected={this.state.selectedSmiley === animationTypes.love}
          onClick={this.onSelect.bind(this, animationTypes.love)}
        />
      </div>
    );
  }
};

export default translate()(ThreePointRating);