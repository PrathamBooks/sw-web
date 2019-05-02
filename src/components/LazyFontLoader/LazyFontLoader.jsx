import { Component } from 'react';
import PropTypes from 'prop-types';
import { fontUrls } from '../../lib/constants';

class LazyFontLoader extends Component {
  static getStyleId(lang) {
    const sanitizedLang = lang.replace(/[()/]/g, '').replace(/\s/g, '-');
    return `LazyFontLoader--${sanitizedLang}`;
  }
  
  componentDidMount() {
    const { languages } = this.props;
    
    languages.forEach(lang => {
      // Check whether the font is in <head>.
      const linkElId = LazyFontLoader.getStyleId(lang);
      let linkEl = document.head.querySelector(`#${linkElId}`);
    
      // If it is, do nothing. Otherwise, insert the font.
      if (!linkEl) {
        const fontUrl = fontUrls[lang];

        if (!fontUrl) {
          return;
        }

        linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.id = linkElId;
        linkEl.href = fontUrl;
        document.head.appendChild(linkEl);
      }
    });
  }
  
  render() {
    return null;
  }
}

LazyFontLoader.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LazyFontLoader;
