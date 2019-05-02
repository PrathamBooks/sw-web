import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { isoDateFormat } from '../../lib/textUtils.js';

class StructuredDataMarkup extends Component {

  render() {
    const {
      list
    } = this.props;

    const getImages = (arr) => arr.map(coverImageUrl => coverImageUrl.url);

    let coverImageUrls = getImages(list.books[0].coverImage.sizes);
    let datePublished = isoDateFormat(list.datePublished);
    let dateModified = isoDateFormat(list.dateModified);
    let publisher = list.publisher || list.organisation

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
                    "headline": "${list.title}",
                    "image": ["${ coverImageUrls ? coverImageUrls : "https://google.com/logo.jpg" }"],
                    "datePublished": "${datePublished}",
                    "dateModified": "${dateModified}",
                    "author": {
                      "@type": "WebSite",
                      "name": "${list.author.name}"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "${ publisher ? publisher.name : "User" }",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "${ publisher ? publisher.profileImage : "https://google.com/logo.jpg" }"
                      }
                    },
                    "description": "${list.description}"
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
                      "name": "lists",
                      "item": "https://storyweaver.org.in/lists"
                    },{
                      "@type": "ListItem",
                      "position": 2,
                      "name": "list",
                      "item": "https://storyweaver.org.in/lists/${list.slug}"
                     }]
                  }
                `}
        </script>
      </Helmet>
    );
  }
}

StructuredDataMarkup.propTypes = {
  list: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    datePublished: PropTypes.string.isRequired,
    publisher: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    authors: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired

  })
};

export default StructuredDataMarkup;