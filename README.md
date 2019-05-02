# sw-js

This repository contains the StoryWeaver web front-end.

To run in debug mode, make sure you have a reasonably modern Node and NPM set up (we use 8.1.4 as of July 19, 2017). Then:

    $ npm install          # install dependencies
    $ npm start            # start the development server

To create an optimized production build:

    $ npm install          # install dependencies
    $ npm build            # create optimized bundles in the `build/` directory

To place the debug/build output in a non-default directory, use the `SW_BUILD_DIR` environment variable. E.g:

    $ SW_BUILD_DIR=/home/kendrick/sw-js-build/ npm start

Or:

    $ SW_BUILD_DIR=/home/kendrick/sw-js-build/ npm build


To use google analytics, replace %GA_PROPERTY_ID% in index.html with the Google Analytics property ID , while doing npm build. After this, the Google Analytics tracking script will be injected into the page's header each time it's loaded and the analytics middleware will start tracking certain analytics events.


## Build Time Environment Variables

### REACT_APP_LOGGLY_KEY

Specifies a key for the Loggly logging service. If the app is being run in development mode and this environment
variable is defined, the Loggly script will be injected into the app. The primary purpose of this is to help with
debgging UC Browser.

### REACT_APP_API_URL

Specifies a base URL for the API.

### REACT_APP_FEATURE_OFFLINE

Specifies whether to enable the Offline feature. 

### REACT_APP_FEATURE_AUTH

Specifies whether to enable the new signup and login feature. 

### REACT_APP_FACEBOOK_APP_ID

appId for Facebook Login

### REACT_APP_GOOGLE_CLIENT_ID

clientId for Google Login

### REACT_APP_EXPANDED_SEARCH_PEOPLE_TAB

Specifies whether to enable the peoples tab in Expanded Search.

### REACT_APP_EXPANDED_SEARCH_ORGANISATION_TAB

Specifies whether to enable the Organisation tab in Expanded Search.

### REACT_APP_SHOW_WHITELABEL_ATTRIBUTION

Specifies whether to enable storyweaver platform attribution panel for whitelabel in the bottom of site footer.