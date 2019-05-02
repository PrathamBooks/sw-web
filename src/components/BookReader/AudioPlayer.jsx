import React, { Component } from "react";
import { translate } from "react-polyglot";
import classNames from "classnames";
import Link from "../Link";
import SvgIcon from "../SvgIcon";

import "./AudioPlayer.scss";

function msToTime(duration) {
  duration = isNaN(duration) ? 0 : duration;
  let milliseconds = parseInt((duration % 1000), 10),
    seconds = parseInt((duration / 1000) % 60, 10),
    minutes = parseInt((duration / (1000 * 60)) % 60, 10), 
    hours = parseInt((duration/(1000*60*60)) % 24, 10);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      muted: false,
      volume: 0.75,
      currentTime: 0
    };
    this.audioElRef = undefined;
  }


  toggleMute = () => {
    this.setState({ muted: !this.state.muted });
  };

  onSliderChange = e => {
    this.setState(
      { volume: e.target.value / 100 },
      () => (this.audioElRef.volume = this.state.volume)
    );
  };

  handleTimeUpdate = () => {
    this.setState({
      currentTime: `${msToTime(
        this.audioElRef.currentTime * 1000
      )} / ${msToTime(this.audioElRef.duration * 1000)}`
    });
  };

  render() {
    const baseClassName = "pb-audio-player";
    const { playing, handlePlay, audioPath, vttPath, disable, displayTime } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--disable`]: disable,
      [`${baseClassName}--fade`]: playing
    };

    return (
      <div className={classNames(classes)}>
        <audio
          id="audio"
          src={audioPath}
          crossOrigin="anonymous"
          muted={this.state.muted}
          ref={aud => (this.audioElRef = aud)}
          onTimeUpdate={this.handleTimeUpdate}
        >
        {vttPath && (
          <track
            kind="subtitles"
            label="English"
            src={vttPath}
            srcLang="en"
            default
          />
        )}
          If you can see update your browser..
        </audio>
        <div className={`${baseClassName}__play`}>
          <Link
            parentClassName={`${baseClassName}__icon`}
            title={"Play"}
            onClick={handlePlay}
          >
            <SvgIcon name={playing ? "pause" : "play"} size={"s-m"} />
          </Link>
        </div>
        <div className={`${baseClassName}__speaker`}>
          <Link
            parentClassName={`${baseClassName}__icon`}
            title={"Mute"}
            onClick={this.toggleMute}
          >
            <SvgIcon name={this.state.muted? "audio-mute" : "audio"} size={"s-m"} />
          </Link>
        </div>
        <div className={`${baseClassName}__volume-slider-wrapper`}>
          <input
            className={`${baseClassName}__volume-slider`}
            type="range"
            min="1"
            max="100"
            value={this.state.volume * 100}
            onChange={this.onSliderChange}
            onInput={this.onSliderChange} // chrome/firefox fix as onChange might not trigger
          />
        </div>
        {displayTime && (
          <div className={`${baseClassName}__time`}>
            {this.state.currentTime}
          </div>
        )}
      </div>
    );
  }
}

export default translate()(AudioPlayer);
