import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import LoaderBlock from '../LoaderBlock';
import Frame from 'react-frame-component';
import { keyCodes, fontUrls, roles as availableRoles, gaEventCategories, gaEventActions, links } from '../../lib/constants';
import {getImageSize} from '../../lib/images';
import AudioPlayer from './AudioPlayer';
import ModalControlButton from '../ModalControlButton';

import './BookReader.scss';

const getCueInfo = () => {
  let iframe = document.getElementsByTagName('iframe')[0];
  let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let arrCue = [...innerDoc.querySelectorAll('[data-cue]')].map(node => node.dataset.cue)
  let minCue = Math.min(...arrCue), 
      maxCue = Math.max(...arrCue);
  return [minCue, maxCue, innerDoc];
}

class BookReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageBlobs: {},
      seekCueIdx: 1,
      playing: false,
      disableAudioControls: false, // disable audio controls if no cues are found in current page
      currentPage: this.props.startPage || 1,
      isLoadingCss: true,
      startTime: 0,
      totalReadTime: 0,
      audioBlob: null,
      coverAudioBlob: null
    };
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    if (this.state.isLoadingCss) {
      return;
    }

    const iframeEl = ReactDOM.findDOMNode(this.iframeWrapperEl).querySelector('iframe');

    // Shitty cross-browser way of adding a keydown listener to an iframe's
    // document. On Firefox, you can't add the event until the iframe's "load"
    // event has fired, so you need to add the event inside the handler for the "load"
    // event. But, on IE and Safari you can't hook into the "load" event at all, so
    // now you have to do long polling on the iframe's document's readyState.
    const pollingTimeMs = 300;
    let timeElapsedMs = 0;
    const timer = setInterval(() => {
      // Clear the interval if, for some reason, the readyState never gets to
      // "complete".
      timeElapsedMs = timeElapsedMs + pollingTimeMs;
      if (timeElapsedMs >= pollingTimeMs * 20) {
        clearInterval(timer);
      }

      if (iframeEl.contentDocument.readyState === 'complete') {
        clearInterval(timer);
        iframeEl.contentDocument.addEventListener('keydown', this.onKeyDown);
      }
    }, pollingTimeMs);

  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoadingCss !== prevState.isLoadingCss) {
      // autoplay preface audio on mount only on desktop devices
      this.props.viewport.medium && this.props.assets.isAudio && this.props.showAudioBookReader && this.initializeSeekCue();
    }
    if (this.state.playing !== prevState.playing) {
      if(this.state.playing) {
        this.setState({
          startTime: Date.now()
        })
      }
      else {
        let totalReadTime = this.state.totalReadTime + (Date.now() - this.state.startTime)
        this.setState({
          totalReadTime
        })
      }
    }
  }

  componentWillMount() {
    fetch(this.props.cssHref)
      .then(response => response.blob())
      .then(imageBlob => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.setState({
          cssBlob: objectURL,
          isLoadingCss: false
        })
      })
      .catch(err => {
        const { offline, addSlimNotification } = this.props
        offline && addSlimNotification({
          type: 'danger',
          content: 'CSS file is missing. Please Re-Save the Story!',
        });
        this.setState({ isLoadingCss: false });
      });

    let imageBlobs = this.state.imageBlobs;
    this.props.pages.forEach((page) => {
      if (page.coverImage && !this.state.imageBlobs[page.pageId]) {
        //https://medium.com/@gabriele.cimato/on-how-to-store-an-image-in-redux-d623bcc06ca7

        const imageSize = getImageSize(this.props.windowDimensions.width)
        fetch(page.coverImage.sizes[imageSize - 1].url)
        .then(response => response.blob())
        .then(imageBlob => {
          let objectURL = URL.createObjectURL(imageBlob);
          imageBlobs[page.pageId] = objectURL;
          this.setState({
            imageBlobs: imageBlobs
          })
        });
      }
    });

    if (this.props.assets.isAudio) {
      fetch(this.props.assets.audioPath)
        .then(response => response.blob())
        .then(audioBlob => {
          const objectURL = URL.createObjectURL(audioBlob);
          this.setState({
            audioBlob: objectURL
          });
        })
        .catch(err => {
          const { offline, showAudioBookReader, addSlimNotification } = this.props
          showAudioBookReader && offline && addSlimNotification({
            type: 'danger',
            content: 'Audio file is missing! Please Re-Save the Story.',
          });
        });

      fetch(this.props.assets.coverAudioPath)
        .then(response => response.blob())
        .then(coverAudioBlob => {
          const objectURL = URL.createObjectURL(coverAudioBlob);
          this.setState({
            coverAudioBlob: objectURL
          });
        })
        .catch(err => {
          const { offline, showAudioBookReader, addSlimNotification } = this.props;
          showAudioBookReader && offline && addSlimNotification({
            type: 'danger',
            content: 'Cover audio file is missing! Please Re-Save the Story.',
          });
        });;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cssHref !== nextProps.cssHref) {
      this.setState({ isLoadingCss: true })
      fetch(nextProps.cssHref)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.setState({
            cssBlob: objectURL,
            isLoadingCss: false
          })
        });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    const {
      offline,
      userEmail,
      book,
      recordGaEvents,
      showAudioBookReader } = this.props;

    if ( showAudioBookReader && !this.props.pages[this.state.currentPage].isLastStoryPage ) {
      recordGaEvents({
        eventCategory: gaEventCategories.book,
        eventAction: gaEventActions.listenAbandoned,
        userEmail: userEmail,
        dimension2: book.level,
        dimension3: book.language,
        dimension4: offline ? 'Offline' : 'Online',
        dimension5: book.slug,
        metric5: this.state.totalReadTime
      })
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === keyCodes.rightArrow) {
      this.nextPage();
    } else if (e.keyCode === keyCodes.leftArrow) {
      this.prevPage();
    } else if (e.keyCode === keyCodes.f) {
      this.onFullScreen();
    } else if (e.keyCode === keyCodes.esc) {
      e.stopPropagation();
      this.props.onClose();
    }
  };

  hasNextPage = () => {
    if (this.state.currentPage + 1 > this.props.pages.length) {
      return false;
    }

    return true;
  }

  nextPage = () => {
    const {
      offline,
      userEmail,
      book,
      recordBookReadCompleted,
      recordGaEvents,
      showAudioBookReader,
      assets,
      slug,
      addSmileyRatingModal,
      pages,
      openNextReadSuggestions,
      onClose,
      fetchSmileyRatingBook } = this.props;

    // Track GA when user has clicked next Page and next page is going to be last Story Page
    if ( pages[this.state.currentPage].isLastStoryPage ) {
      showAudioBookReader
      ?
      recordGaEvents({
        eventCategory: gaEventCategories.book,
        eventAction: gaEventActions.listenCompleted,
        userEmail: userEmail,
        dimension2: book.level,
        dimension3: book.language,
        dimension4: offline ? 'Offline' : 'Online',
        dimension5: book.slug,
        metric5: this.state.totalReadTime
      })
      :
      recordBookReadCompleted({offline, userEmail, language: book.language, level: book.level, slug: book.slug})
    }

    if ( pages[this.state.currentPage - 1].isLastStoryPage && !offline ) {

      if (assets.isLanguageReviewer && assets.reviewStory) {
        window.location.href = links.storyReview(slug);
      }	
      else if( !assets.hasSmileyRating ) {
        fetchSmileyRatingBook(slug)
        .then( addSmileyRatingModal({showAudioBookReaderOnBack: showAudioBookReader}));
      }
      
      else {
        openNextReadSuggestions();
      }
      onClose();
    }
    
    if (this.hasNextPage()) {
      this.setState({
        currentPage: this.state.currentPage + 1
      }, function() {
        this.props.assets.isAudio && this.props.showAudioBookReader && this.initializeSeekCue();
      });
    }
  }

  hasPrevPage = () => {
    if (this.state.currentPage - 1 < 1) {
      return false;
    }

    return true;
  }

  prevPage = () => {
    
    if (this.hasPrevPage()) {
      this.setState({
        currentPage: Math.max(0, this.state.currentPage - 1)
      }, function() {
        this.props.assets.isAudio && this.props.showAudioBookReader && this.initializeSeekCue();
      });
    }
  }

  replaceImages = (root, pageId) => {
    if (!root) {
      return;
    }

    const imageEl = root.querySelector('.responsive_illustration');

    if (imageEl) {
        let  imageBlobs = this.state.imageBlobs;
        if (imageBlobs[pageId]) {
          imageEl.setAttribute('src', imageBlobs[pageId]);
        }
        else {
          //If somehow the page's image has not been loaded while prefetching, will start the fetch again here
          const imageSize = getImageSize(this.props.windowDimensions.width);
          fetch(imageEl.dataset[`size${imageSize}Src`])
            .then(response => response.blob())
            .then(imageBlob => {
              const objectURL = URL.createObjectURL(imageBlob);
              imageEl.setAttribute('src', objectURL);
              imageBlobs[pageId] = objectURL;
              this.setState({
                imageBlobs: imageBlobs
              })
            });
        }
    }

    const publisherLogoEl = root.querySelector('.publisher-logo');

    if (publisherLogoEl) {
      fetch(publisherLogoEl.dataset.size1Src)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          publisherLogoEl.setAttribute('src', objectURL);
        });
    }

    const bookLevelsEl = root.querySelector('.book-levels');

    if (bookLevelsEl) {
      fetch(bookLevelsEl.dataset.size1Src)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          bookLevelsEl.setAttribute('src', objectURL);
        });
    }
  }

  getFullScreenPropValue = (fullScreenProps, el) => {
    const elToTest = el || ReactDOM.findDOMNode(this.iframeWrapperEl);

    if (!elToTest) {
      return;
    }

    const availableFullScreenProp = fullScreenProps.find(p => p in elToTest);
    if (!availableFullScreenProp) {
      return;
    }

    return { val: elToTest[availableFullScreenProp], el: elToTest };
  }

  isReaderFullScreen = () => {
    const iframeEl = ReactDOM.findDOMNode(this.iframeWrapperEl);
    const { val } = this.getFullScreenPropValue([
      'fullscreenElement',
      'mozFullScreenElement',
      'msFullscreenElement',
      'webkitFullscreenElement',
    ], document);

    if (val && val === iframeEl) {
      return true;
    }

    return false;
  }

  enterFullScreen = () => {
    const { val, el } = this.getFullScreenPropValue([
      'requestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
      'webkitRequestFullscreen',
    ]);

    if (val) {
      val.bind(el)();
    }
  }

  exitFullScreen = () => {
    const { val, el } = this.getFullScreenPropValue([
      'exitFullscreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
      'webkitExitFullscreen'
    ], document);

    if (val) {
      val.bind(el)();
    }
  }

  onFullScreen = () => {
    if (this.isReaderFullScreen()) {
      this.exitFullScreen();
    } else {
      this.enterFullScreen();
    }
  }

  // this function is called only for audio stories  
  initializeSeekCue = () => {
    if (!this.props.showAudioBookReader)
      return;
    let audioElement = document.querySelector("audio");
    
    if (audioElement) {
      audioElement.pause();
      this.setState({ playing: false });
      if (this.state.currentPage === 1) {
        this.handlePlay();
        return;
      };
    } 
    
    let minCue = getCueInfo()[0];
    let innerDoc = getCueInfo()[2];
    let dataCues = innerDoc.querySelectorAll('[data-cue]');
    
    this.setState({ seekCueIdx: minCue });
    if(dataCues.length > 0) {
      dataCues[0].classList.add("audio-highlight");
      this.setState({ disableAudioControls: false }, this.handlePlayWithHighlight);
    } else {
      this.setState({ disableAudioControls: true });
    } 
  }

  handlePlay = () => {
    let audioElement = document.querySelector("audio");
    if(audioElement.paused) {
      audioElement.play();
      this.setState({ playing: true });
    } else {
      audioElement.pause();
      this.setState({ playing: false });
    } 
    let bookReaderRef = this;
    audioElement.onended = function() {
      bookReaderRef.setState({ playing: false });
    };
  }

  handlePlayWithHighlight = () => {
    let audioElement = document.querySelector("audio");
    let bookReaderRef = this;
    let textTracks = audioElement.textTracks; // one for each track element
    let textTrack = textTracks[0]; // corresponds to the first track element
    let prevCueIdx = this.state.seekCueIdx - 2; // - 2 as highlight class is added only after cue change event
    
    textTrack.mode = "showing";
    // condition to make sure text track is successfully loaded
    audioElement.currentTime = textTrack.cues[this.state.seekCueIdx - 1] ? textTrack.cues[this.state.seekCueIdx - 1].startTime : 0;

    if(audioElement.paused) {
      audioElement.play();
      this.setState({ playing: true });
    } else {
      audioElement.pause();
      this.setState({ playing: false });
    } 

    textTrack.oncuechange = function() {
      let cueChangeFromPage = bookReaderRef.state.currentPage;
      let cue = this.activeCues[0]; // assuming there is only one active cue
      let [minCue, maxCue, innerDoc] = getCueInfo();
      let highlightedWords = innerDoc.querySelectorAll(".audio-highlight");
    
      for (let i = 0; i < highlightedWords.length; i++) {
        highlightedWords[i].classList.remove("audio-highlight");
      }

      if (cue) {
        bookReaderRef.setState({ seekCueIdx: +cue.id + 1 }); // as cue array starts from 0
        // highlight all words that is getting skipped whose duration is less than ~200ms
        for(let i = prevCueIdx + 1; i <= cue.id; i++) {
          let cueEl =  innerDoc.querySelector(`span[data-cue='${i}']`);
          if (cueEl) {
            cueEl.classList.add("audio-highlight");
            prevCueIdx = i;
          }
        }

        if(bookReaderRef.state.seekCueIdx < minCue || bookReaderRef.state.seekCueIdx > maxCue) {
          let remainingTime = cue.endTime - audioElement.currentTime;

          bookReaderRef.setState({ seekCueIdx: minCue });
          // pause the audio only after playing the current data cue.
          setTimeout(() => { 
            if(bookReaderRef.state.currentPage > 1 && cueChangeFromPage === bookReaderRef.state.currentPage) {
              audioElement.pause();
              bookReaderRef.setState({
                playing: false
              });
            }
          }, (remainingTime) * 1000);
          
        }
      }
    }
  }

  render() {
    const { currentPage } = this.state;
    const {
      orientation,
      language,
      onClose,
      offline,
      assets,
      showAudioBookReader,
      userRoles, 
      viewport
    } = this.props;

    const {
      cssBlob,
      isLoadingCss
    } = this.state;

    const baseClassName = 'pb-book-reader';

    const mountTarget = 'story';

    const fontHref = fontUrls[language];
    const fontLink = fontHref ? `<link rel="stylesheet" type="text/css" href=${fontHref}>` : '';
    const cssLink = cssBlob ? `<link rel="stylesheet" type="text/css" href=${cssBlob} />` : '';
    

    // Added cssBlob link to initialContent Ref. https://github.com/ryanseddon/react-frame-component/issues/74

    const initialContent = `
      <!DOCTYPE html>
      <html>
        <head>
          ${cssLink}
          <base target="_parent">
          ${fontLink}
        </head>
        <body>
          <div id="${mountTarget}"></div>
        </body>
      </html>
    `;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${orientation}`]: orientation
    };

    const frameClasses = {
      [`${baseClassName}__frame`]: true,
      [`${baseClassName}__frame--no-pointer-events`]: offline,
    }

    if (isLoadingCss) {
      return (<div className={classNames(classes)} >
                <div className={`${baseClassName}__wrapper`}>
                  <LoaderBlock />
                </div>
              </div>)
    }

    return (
      <div
        className={classNames(classes)}
        ref={ref => this.iframeWrapperEl = ref}>
        <div
          className={`${baseClassName}__wrapper`}>
          <Frame
            className={classNames(frameClasses)}
            initialContent={initialContent}
            mountTarget={`#${mountTarget}`}
          >
            <div
              dangerouslySetInnerHTML={{__html: this.props.pages[currentPage - 1].html}}
              ref={ref => this.replaceImages(ref, this.props.pages[currentPage - 1].pageId)}
            />
          </Frame>
          <div className={`${baseClassName}__control ${baseClassName}__control--close`}>
            <ModalControlButton icon="close" label="Close" onClick={onClose}/>
          </div>
          { 
            assets.isAudio 
            && 
            showAudioBookReader 
            && 
            <AudioPlayer 
              playing={this.state.playing}
              handlePlay={this.state.currentPage === 1 ? this.handlePlay : this.handlePlayWithHighlight}
              audioPath={this.state.currentPage === 1 ? this.state.coverAudioBlob : this.state.audioBlob}
              vttPath={this.state.currentPage === 1 ? null : assets.vttFilePath}
              disable={this.state.disableAudioControls}
              displayTime={userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER) && viewport.medium}
            />
          }
          {
            this.hasPrevPage()
            ?
            <div className={`${baseClassName}__control ${baseClassName}__control--prev`}>
              <ModalControlButton icon="chevron-left" label="Previous" onClick={this.prevPage}/>
            </div>
            :
            null
          }
          {
            this.hasNextPage()
            ?
            <div className={`${baseClassName}__control ${baseClassName}__control--next`}>
              <ModalControlButton icon="chevron-right" label="Next" onClick={this.nextPage}/>
            </div>
            :
            null
          }
          <div className={`${baseClassName}__control ${baseClassName}__control--fullscreen`}>
            <ModalControlButton icon="fullscreen" label="Fullscreen" onClick={this.onFullScreen}/>
          </div>
        </div>
      </div>
    );
  }
}

BookReader.propTypes = {
  pages: PropTypes.array.isRequired,
  cssHref: PropTypes.string.isRequired,
  viewport: PropTypes.object.isRequired,
  orientation: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default BookReader;
