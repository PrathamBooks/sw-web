import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { isoDateFormat } from '../../lib/textUtils.js';

class StructuredDataMarkup extends Component {

  render() {
    const {
      book
    } = this.props;

    const getAuthors = (arr) => arr.map(author => author.name);
    const getImages = (arr) => arr.map(coverImageUrl => coverImageUrl.url);

    let authorNames = getAuthors(book.authors);
    let coverImageUrls = getImages(book.coverImage.sizes);
    let publishedDate = isoDateFormat(book.publishedDate);

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
                    "headline": "${book.name}",
                    "image": ["${coverImageUrls}"],
                    "datePublished": "${publishedDate}",
                    "author": {
                      "@type": "WebSite",
                      "name": "${authorNames}"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "${book.publisher.name}",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "${book.publisher.logo}"
                      }
                    },
                    "description": "${book.description}"
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
                      "name": "Stories",
                      "item": "https://storyweaver.org.in/stories"
                    },{
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Story",
                      "item": "https://storyweaver.org.in/stories/${book.slug}"
                     }]
                  }
                `}
        </script>
      </Helmet>
    );
  }
}

StructuredDataMarkup.propTypes = {
  book: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    publishedDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    publisher: PropTypes.object.isRequired,
    coverImage: PropTypes.object.isRequired,
    authors:PropTypes.array.isRequired
  })
};

export default StructuredDataMarkup;