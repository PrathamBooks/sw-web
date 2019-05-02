import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class StructuredDataMarkup extends Component {

    render() {
        return (
            <Helmet>
                <script type="application/ld+json">{`
                        {
                            "@context": "http://schema.org",
                            "@type": "Organization",
                            "name": "Story Weaver",
                            "url": "https://storyweaver.org.in/",
                            "logo": "https://storyweaver.org.in/assets/media/storyweaver-logo.e8ce4cf1.svg",
                            "sameAs": [
                            "https://www.facebook.com/pbstoryweaver",
                            "https://www.instagram.com/pbstoryweaver/",
                            "https://twitter.com/pbstoryweaver",
                            "https://www.youtube.com/channel/UCH9_ahl5Vu8P9tElauPWahg" 
                            ]
                        }
                    `}
                </script>
            </Helmet>
        );
    }
}

export default StructuredDataMarkup;