import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { isoDateFormat } from '../../lib/textUtils.js';

class StructuredDataMarkup extends Component {

  render() {
    const {
      illustration
    } = this.props;

    const getAuthors = (arr) => arr.map(author => author.name);
    const getImages = (arr) => arr.map(coverImageUrl => coverImageUrl.url);

    let authorNames = getAuthors(illustration.illustrators);
    let coverImageUrls = getImages(illustration.imageUrls[0].sizes);
    let datePublished = isoDateFormat(illustration.datePublished);
    let dateModified = isoDateFormat(illustration.dateModified);

    return (
      <Helmet>
        <script type="application/ld+json">{`
                  {
                    "@context": "http://schema.org",
                    "@type": "NewsArticle",
                    "mainEntityOfPage": {
                      "@type": "WebPage",
                      "@id": "https://google.com/article"
                    },
                    "headline": "${illustration.title}",
                    "image": ["${coverImageUrls}"],
                    "datePublished": "${datePublished}",
                    "dateModified": "${dateModified}",
                    "author": {
                      "@type": "WebSite",
                      "name": "${authorNames}"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "${illustration.publisher.name}",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "${illustration.publisher.logo}"
                      }
                    },
                    "description": "${illustration.attribution_text}"
                  }
                `}
        </script>
        <script type="application/ld+json">{`
                  {
                    "@context": "http://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                      "@type": "ListItem",
                      "position": 1,
                      "name": "illustrations",
                      "item": "https://storyweaver.org.in/illustrations"
                    },{
                      "@type": "ListItem",
                      "position": 2,
                      "name": "illustration",
                      "item": "https://storyweaver.org.in/illustrations/${illustration.slug}"
                     }]
                  }
                `}
        </script>
      </Helmet>
    );
  }
}

StructuredDataMarkup.propTypes = {
  illustration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    datePublished: PropTypes.string.isRequired,
    attribution_text: PropTypes.string.isRequired,
    publisher: PropTypes.object.isRequired,
    imageUrls: PropTypes.array.isRequired,
    illustrators:PropTypes.array.isRequired
  })
};

export default StructuredDataMarkup;