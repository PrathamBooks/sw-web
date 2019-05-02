import queryString from 'query-string'

export const profileTypes = {
  USER: 'user',
  ORGANISATION: 'organisation',
  PUBLISHER: 'publisher'
};

export const collectionLimits = {
  small: 6,
  medium: 20
};

export const imageSrcsetSizes = {
  grid2up6up: {
    '(min-width: 1048px)':  {
      value: 200,
      unit: 'px'
    },
    '(min-width: 768px)': 34, // unit vw
    'default': 50 // unit vw
  },
  grid4up: {
    '(min-width: 1048px)':  {
      value: 280,
      unit: 'px'
    },
    '(min-width: 768px)': 34, // unit vw
    'default': 50 // unit vw
  },
}

export const keyCodes = {
  leftArrow: 37,
  upArrow: 38,
  rightArrow: 39,
  downArrow: 40,
  esc: 27,
  f: 70,
  return: 13,
};

export const orientation = {
  portrait: 'portrait',
  landscape: 'landscape'
};

export const pagination = {
  allBooks: 24,
  allLists: 24,
  images: 24,
  allIllustrations: 24,
  usersSearch: 20,
  organisationsSearch: 20,
  bookTranslations: 24
};

export const sortOptions = {
  relevance: 'Relevance',
  newArrivals: 'New Arrivals',
  mostRead: 'Most Read',
  mostLiked: 'Most Liked',
  editorsPicks: 'Editor\'s Picks',
  mostViewed: 'Most Viewed',
  ratings: 'Ratings'
};

export const bulkDownloadOptions = {
  allImages: 'All Images',
  allStories: 'All Stories',
  notDownloaded: 'Not Downloaded'
};

export const defaultBulkDownloadFormat = {
  stories: 'PDF',
  images: 'JPEG'
};

export const mailIds = {
  helpMailId: 'help@storyweaver.org.in'
};

export const nextSuggestionsTypes = {
  nextRead: 'Next Read',
  nextTranslation: 'Next Translation',
}; 

export const links = {
  allBooksPath: () => "/stories",
  allBooks: (sortOption = sortOptions.relevance, languagePreferences = [], readingLevels = []) =>
    `/stories?${queryString.stringify({ sort: sortOption , language: languagePreferences , level: readingLevels })}`,
  allAudioBooks: (sortOption = sortOptions.relevance, languagePreferences = [], readingLevels = [], story_type = ['audio']) => `/audios?${queryString.stringify({sort: sortOption , language: languagePreferences , level: readingLevels, story_type: story_type,  isAudio: true})}`,
  allTranslate: () => '/translate/all',
  analytics: () => '/v0/dashboard/analytics',
  blog: () => '/v0/blog',
  blogDashboard: () => '/v0/blog/dashboard',
  bookDetails: (slug) => `/stories/${slug}`,
  contests: () => '/v0/contests',
  create: () => '/v0/editor/create',
  dashboard: () => '/v0/dashboard',
  editor: (id) => `/v0/editor/story/${id}`,
  editPublishedStory: (id) => `/v0/stories/${id}/editable`,
  home: () => '/',
  lists: () => '/lists',
  images: () => '/v0/illustrations',
  illustrationV0: (slug) => `/v0/illustrations/${slug}`,
  downloadList: (slug) => `/v0/lists/${slug}/download?d_format=pdf&high_resolution=false`,
  allIllustrations: (sortOption = sortOptions.relevance) => `/illustrations?sort=${sortOption}`,
  illustration: (slug) => `/illustrations/${slug}`,
  login: () => '/users/sign_in',
  myLists: () => '/me/lists',
  offlineBooks: () => '/offline',
  profile: (type, slug) => `/${type}/${slug}`,
  profileDashboard: () => '/v0/profile',
  privacyPolicy: () => '/privacy_policy',
  rateStory: () => '/v0/reviewer/un_reviewed_stories',
  ratingDashboard: () => '/v0/dashboard/un_reviewed_stories',
  relevelBook: (slug) => `/v0/editor/${slug}/relevel`,
  signup: () => '/users/sign_up',
  translate: () => '/translate',
  translateBook: (slug) => `/v0/editor/${slug}/translate`,
  translateBookToLanguage: (slug, toLanguage) => `/v0/editor/${slug}/translate?to_language=${toLanguage}`,
  translationDashboard: () => '/v0/dashboard/translate_stories',
  searchBy: (query) => `/search?query=${query}`,
  searchByTag: (tag) => `/search?tags=${tag}`,
  searchByCategory: (query) => `/search?${queryString.stringify({category: query})}`,
  searchByIllustration: (slug) => `/stories?illustration_slug=${slug}`,
  searchIllustrationsByTag: (tag) => `/search?tags=${tag}&item=images`,
  searchIllustrationsByCategory: (query) => `/search?${queryString.stringify({category: query, tab: "images" })}`,
  searchIllustrationsByStyle: (query) => `/search?${queryString.stringify({style: query, tab: "images" })}`,

  untranslatedStories: () => '/v0/translator/un_translated_stories',
  userProfile: (slug) => `/users/${slug}`,
  createStoryFromIllustration: (slug) =>`/v0/stories/create_story_from_illustration?id=${slug}`,
  storiesByCategory: (query) => `/stories?${queryString.stringify({category: query, isStoryCategory: true})}`,
  ccLicense: () => `https://creativecommons.org/licenses/by/4.0/`,
  termsOfUse: () => `/terms_and_conditions`,
  uploadGoodPractice:() => `/uploading_an_illustration#faq2`,
  bulkStoriesDownload: (query) => `/api/v1/bulk-download?${queryString.stringify(query)}`,
  bulkImagesDownload: (query) => `/api/v1/image-bulk-download?${queryString.stringify(query)}`,
  confirmationLink:() => `/users/confirmation/new`,
  offlineBooksFormLink:() => `https://docs.google.com/forms/d/e/1FAIpQLSdkyvnn0j-q3TcLNRP2UrRuRmTIkvHgypu9wqT-SkBl_Hc1JQ/viewform`,
  homePopUpPhoneStoryLink:() => `https://storyweaver.org.in/stories/26690-miss-laya-s-fantastic-motorbike-does-not-like-fruits`,
  swPlatform:() => `https://storyweaver.org.in`,
  list: (slug) => `/lists/${slug}`,
  googleFormBookDownloadLink: (userDetails) => `https://docs.google.com/forms/d/e/1FAIpQLScugX7B5Xcc-AwNec6qt3OlW8Kq-RPLESrGqF2ACE-Hjtb-3w/viewform?entry.1402735984=${userDetails.userEmail || ''}&entry.1884270710=${userDetails.name || ''}&entry.749985689=${userDetails.organisation || 'N.A.'}&entry.482710811=${userDetails.country || 'N.A.'}`,
  googleFormIllustrationDownloadLink: (userDetails) => `https://docs.google.com/forms/d/e/1FAIpQLSeVdiSywdbtYXxr92mPZwHMSMgpRzZ26bMIa7-n-C4s7lktjw/viewform?usp=pp_url&entry.1620316252=${userDetails.userEmail || ''}&entry.318407001=${userDetails.name || ''}&entry.368081528=${userDetails.organisation || 'N.A.'}&entry.1199464032=${userDetails.country || 'N.A.'}`,
  storyReview: (slug) => `/v0/stories/${slug}/story-review`,
  mailToLink: (mailId) => `mailto:${mailId}`,
};

export const feedbackLinks = {
  ListModal: 'https://docs.google.com/forms/d/e/1FAIpQLSfe1Wn1hnbjEHILZ72b04IeN8JLN7QjQTGX0Am33CbewRdfLQ/viewform?usp=sf_link'
};

export const roles = {
  CONTENT_MANAGER: 'content_manager',
  PUBLISHER: 'publisher',
  REVIEWER: 'reviewer'
}

export const delays = {
  ListModal: 30000,
  slimNotificationModal: 8000
}

export const userFeedbackPopups = {
  ListModal: 'ListModal'
}

export const animationTypes = {
  okay: 'okay',
  like: 'like',
  love: 'love'
}

export const userAuthStages = {
  'empty': 'empty',
  'password': 'password',
  'userInfo': 'userInfo',
  'language': 'language',
  'userPreferences': 'userPreferences',
  'newPassword': 'newPassword',
  'resetPassword': 'resetPassword',
  'onlyMessage': 'onlyMessage',
  'resendConfirmationMail': 'resendConfirmationMail'
};

export const gaEventCategories = {
  'list': 'List',
  'offline': 'Offline',
  'categoryCard': 'CategoryCard',
  'book': 'Book',
  'bookShelf': 'Bookshelf',
  'illustration': 'Illustration',
  'bulkDownload': 'bulkDownload',
  'profile': 'Profile',
  'nextReadSuggestion': 'NextReadSuggestion',
  'smileyRating': 'SmileyRating',
  'audioSmileyRating': 'AudioSmileyRating',
  'imageBulkDownload': 'ImageBulkDownload',
  'filterRead' : 'FilterRead',
  'filterReadalong': 'FilterReadalong',
  'filterImage':'FilterImage',
  'filterTranslate': 'FilterTranslate'
};

export const gaEventActions = {
  'download': 'Download',
  'read': 'Read',
  'add': 'Add',
  'delete': 'Delete',
  'liked': 'Liked',
  'opened': 'Opened',
  'closed': 'Closed',
  'shared': 'Shared',
  'bookPageOpenedFromList': 'BookDetailsPageOpenedFromList',
  'listened': 'Listened',
  'listenCompleted': 'Listen Completed',
  'skipped': 'Skipped',
  'flagged': 'Flagged',
  'back': 'Back',
  'submit': 'Submit',
  'listenAbandoned': 'Listen Abandoned'
};

export const sectionClicked = {
  'bookCard': 'Book Card',
  'bookCardIcon': 'Book Card Icon',
  'bookCardLink': 'Book Card Link',
  'bookDetails': 'Book Details',
  'quickViewModal': 'Quick View Modal',
  'nextReadCard': 'Next Read Card',
  'nextReadButton': 'Next Read Button',
  'allStories': 'All Stories',
  'similarBooks': 'Similar Books',
  'editorPicks': 'Editors picks',
  'mostReads': 'Most Read',
  'newArrivals': 'Recent Arrivals',
  'homeRecommendation': 'Home Recommendation',
  'illustrationSearchPage': 'Illustration Search Page',
  'allImagesPage': 'All Images Page',
  'illustrationDetails': 'Illustration Details',
  'illustrationExpandedSearchPage': 'Illustration Expanded Search Page',
  'ListPageBookCard': 'List Page Book Card',
  'ListPageBookTitle': 'List Page Book Title'
};

export const linkType = {
  'createdBy': 'Created by',
  'translatedBy': 'Translated by',
  'writtenBy': 'Written by',
  'illustratedBy': 'Illustrated by',
  'photographedBy': 'Photograph by',
  'originalStory': 'original Story'
};

export const bookDownloadFormats = {
  'pdf': 'PDF',
  'ePub': 'ePub',
  'text': 'Text Only',
  'hiResPdf': 'HiRes PDF'
};

export const imageDownloadFormats = {
  'jpeg': 'JPEG',
  'hiResJpeg': 'HiRes JPEG'
};

export const swCookies = {
  'consent': 'sw-consent'
};

export const gaEventWhitelistedFilters = ['level', 'publisher', 'category', 'language', 'style']

export const licenses = [{ name: 'CC BY 4.0', queryValue: 'CC BY 4.0' }];
// Sorry, kids!
export const MAX_OFFLINE_BOOKS_COUNT = 12
export const MAX_BULK_DOWNLOAD_BOOKS_COUNT = 10
export const MAX_BULK_DOWNLOAD_IMAGES_COUNT = 10

// The keys here should be the exact strings that the server returns
// in a book's `language` field.
//
// Additionally, the font-family should be mentioned in the variable
// `$font-family-rare-language-fallbacks` in the file `_design-tokens.scss`.
export const fontUrls = {
  Gujarati: 'https://fonts.googleapis.com/earlyaccess/notosansgujarati.css',
  'English-Gujarati': 'https://fonts.googleapis.com/earlyaccess/notosansgujarati.css',

  Kannada: 'https://fonts.googleapis.com/earlyaccess/notosanskannada.css',
  'English-Kannada': 'https://fonts.googleapis.com/earlyaccess/notosanskannada.css',

  Telugu: 'https://fonts.googleapis.com/earlyaccess/notosanstelugu.css',
  'English-Telugu': 'https://fonts.googleapis.com/earlyaccess/notosanstelugu.css',

  Odia: 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',
  'English-Odia': 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',
  'Juanga-Odia': 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',
  'Kui-Odia': 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',
  'Munda-Odia': 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',
  'Saura-Odia': 'https://fonts.googleapis.com/earlyaccess/notosansoriya.css',

  Tamil: 'https://fonts.googleapis.com/earlyaccess/notosanstamil.css',
  'English-Tamil': 'https://fonts.googleapis.com/earlyaccess/notosanstamil.css',

  Marathi: 'https://fonts.googleapis.com/earlyaccess/notosansdevanagari.css',
  'English-Marathi': 'https://fonts.googleapis.com/earlyaccess/notosansdevanagari.css',

  Hindi: 'https://fonts.googleapis.com/earlyaccess/notosansdevanagari.css',
  'English-Hindi': 'https://fonts.googleapis.com/earlyaccess/notosansdevanagari.css',

  Tibetan: 'https://fonts.googleapis.com/earlyaccess/notosanstibetan.css',
  Punjabi: 'https://fonts.googleapis.com/earlyaccess/notosansgurmukhi.css',
  Sinhala: 'https://fonts.googleapis.com/earlyaccess/notosanssinhala.css',
  'Santali (Ol Chiki)': 'https://fonts.googleapis.com/earlyaccess/notosansolchiki.css',
  Bhoti: 'https://fonts.googleapis.com/earlyaccess/notosanstibetan.css',
};

export const countries = [
  {name:"Afghanistan", queryValue: "Afghanistan"},
  {name:"Aland Islands", queryValue: "Aland Islands"},
  {name:"Albania", queryValue: "Albania"},
  {name:"Algeria", queryValue: "Algeria"},
  {name:"American Samoa", queryValue: "American Samoa"},
  {name:"Andorra", queryValue: "Andorra"},
  {name:"Angola", queryValue: "Angola"},
  {name:"Anguilla", queryValue: "Anguilla"},
  {name:"Antarctica", queryValue: "Antarctica"},
  {name:"Antigua and Barbuda", queryValue: "Antigua and Barbuda"},
  {name:"Argentina", queryValue: "Argentina"},
  {name:"Armenia", queryValue: "Armenia"},
  {name:"Aruba", queryValue: "Aruba"},
  {name:"Australia", queryValue: "Australia"},
  {name:"Austria", queryValue: "Austria"},
  {name:"Azerbaijan", queryValue: "Azerbaijan"},
  {name:"Bahamas", queryValue: "Bahamas"},
  {name:"Bahrain", queryValue: "Bahrain"},
  {name:"Bangladesh", queryValue: "Bangladesh"},
  {name:"Barbados", queryValue: "Barbados"},
  {name:"Belarus", queryValue: "Belarus"},
  {name:"Belgium", queryValue: "Belgium"},
  {name:"Belize", queryValue: "Belize"},
  {name:"Benin", queryValue: "Benin"},
  {name:"Bermuda", queryValue: "Bermuda"},
  {name:"Bhutan", queryValue: "Bhutan"},
  {name:"Bolivia", queryValue: "Bolivia"},
  {name:"Bonaire, Sint Eustatius And Saba", queryValue: "Bonaire, Sint Eustatius And Saba"},
  {name:"Bosnia and Herzegovina", queryValue: "Bosnia and Herzegovina"},
  {name:"Botswana", queryValue: "Botswana"},
  {name:"Br. Indian Ocean Ter.", queryValue: "Br. Indian Ocean Ter."},
  {name:"Brazil", queryValue: "Brazil"},
  {name:"Brunei Darussalam", queryValue: "Brunei Darussalam"},
  {name:"Bulgaria", queryValue: "Bulgaria"},
  {name:"Burkina Faso", queryValue: "Burkina Faso"},
  {name:"Burundi", queryValue: "Burundi"},
  {name:"Cambodia", queryValue: "Cambodia"},
  {name:"Cameroon", queryValue: "Cameroon"},
  {name:"Canada", queryValue: "Canada"},
  {name:"Cape Verde", queryValue: "Cape Verde"},
  {name:"Cayman Islands", queryValue: "Cayman Islands"},
  {name:"Central African Rep.", queryValue: "Central African Rep."},
  {name:"Chad", queryValue: "Chad"},
  {name:"Chile", queryValue: "Chile"},
  {name:"China", queryValue: "China"},
  {name:"Christmas Island", queryValue: "Christmas Island"},
  {name:"Cocos (Keeling) Islands", queryValue: "Cocos (Keeling) Islands"},
  {name:"Colombia", queryValue: "Colombia"},
  {name:"Comoros", queryValue: "Comoros"},
  {name:"Congo (Dem. Rep.)", queryValue: "Congo (Dem. Rep.)"},
  {name:"Congo (Rep.)", queryValue: "Congo (Rep.)"},
  {name:"Cook Islands", queryValue: "Cook Islands"},
  {name:"Costa Rica", queryValue: "Costa Rica"},
  {name:"Côte d'Ivoire", queryValue: "Côte d'Ivoire"},
  {name:"Croatia", queryValue: "Croatia"},
  {name:"Cuba", queryValue: "Cuba"},
  {name:"Curacao", queryValue: "Curacao"},
  {name:"Cyprus", queryValue: "Cyprus"},
  {name:"Czech Republic", queryValue: "Czech Republic"},
  {name:"Denmark", queryValue: "Denmark"},
  {name:"Djibouti", queryValue: "Djibouti"},
  {name:"Dominica", queryValue: "Dominica"},
  {name:"Dominican Republic", queryValue: "Dominican Republic"},
  {name:"Ecuador", queryValue: "Ecuador"},
  {name:"Egypt", queryValue: "Egypt"},
  {name:"El Salvador", queryValue: "El Salvador"},
  {name:"Equatorial Guinea", queryValue: "Equatorial Guinea"},
  {name:"Eritrea", queryValue: "Eritrea"},
  {name:"Estonia", queryValue: "Estonia"},
  {name:"Ethiopia", queryValue: "Ethiopia"},
  {name:"Falkland Is. (Malvinas)", queryValue: "Falkland Is. (Malvinas)"},
  {name:"Faröe Islands", queryValue: "Faröe Islands"},
  {name:"Fiji", queryValue: "Fiji"},
  {name:"Finland", queryValue: "Finland"},
  {name:"France", queryValue: "France"},
  {name:"French Guiana", queryValue: "French Guiana"},
  {name:"French Polynesia", queryValue: "French Polynesia"},
  {name:"French Southern Territories", queryValue: "French Southern Territories"},
  {name:"Gabon", queryValue: "Gabon"},
  {name:"Gambia", queryValue: "Gambia"},
  {name:"Georgia", queryValue: "Georgia"},
  {name:"Germany", queryValue: "Germany"},
  {name:"Ghana", queryValue: "Ghana"},
  {name:"Gibraltar", queryValue: "Gibraltar"},
  {name:"Greece", queryValue: "Greece"},
  {name:"Greenland", queryValue: "Greenland"},
  {name:"Grenada", queryValue: "Grenada"},
  {name:"Guadeloupe", queryValue: "Guadeloupe"},
  {name:"Guam", queryValue: "Guam"},
  {name:"Guatemala", queryValue: "Guatemala"},
  {name:"Guernsey", queryValue: "Guernsey"},
  {name:"Guinea", queryValue: "Guinea"},
  {name:"Guinea-Bissau", queryValue: "Guinea-Bissau"},
  {name:"Guyana", queryValue: "Guyana"},
  {name:"Haiti", queryValue: "Haiti"},
  {name:"Honduras", queryValue: "Honduras"},
  {name:"Hong Kong", queryValue: "Hong Kong"},
  {name:"Hungary", queryValue: "Hungary"},
  {name:"Iceland", queryValue: "Iceland"},
  {name:"India", queryValue: "India"},
  {name:"Indonesia", queryValue: "Indonesia"},
  {name:"Iran", queryValue: "Iran"},
  {name:"Iraq", queryValue: "Iraq"},
  {name:"Ireland", queryValue: "Ireland"},
  {name:"Isle of Man", queryValue: "Isle of Man"},
  {name:"Israel", queryValue: "Israel"},
  {name:"Italy", queryValue: "Italy"},
  {name:"Jamaica", queryValue: "Jamaica"},
  {name:"Japan", queryValue: "Japan"},
  {name:"Jersey", queryValue: "Jersey"},
  {name:"Jordan", queryValue: "Jordan"},
  {name:"Kazakhstan", queryValue: "Kazakhstan"},
  {name:"Kenya", queryValue: "Kenya"},
  {name:"Kiribati", queryValue: "Kiribati"},
  {name:"Korea (Dem. Rep.)", queryValue: "Korea (Dem. Rep.)"},
  {name:"Korea (Rep.)", queryValue: "Korea (Rep.)"},
  {name:"Kuwait", queryValue: "Kuwait"},
  {name:"Kyrgyzstan", queryValue: "Kyrgyzstan"},
  {name:"Laos", queryValue: "Laos"},
  {name:"Latvia", queryValue: "Latvia"},
  {name:"Lebanon", queryValue: "Lebanon"},
  {name:"Lesotho", queryValue: "Lesotho"},
  {name:"Liberia", queryValue: "Liberia"},
  {name:"Libya", queryValue: "Libya"},
  {name:"Liechtenstein", queryValue: "Liechtenstein"},
  {name:"Lithuania", queryValue: "Lithuania"},
  {name:"Luxembourg", queryValue: "Luxembourg"},
  {name:"Macao", queryValue: "Macao"},
  {name:"Macedonia, TFYR", queryValue: "Macedonia, TFYR"},
  {name:"Madagascar", queryValue: "Madagascar"},
  {name:"Malawi", queryValue: "Malawi"},
  {name:"Malaysia", queryValue: "Malaysia"},
  {name:"Maldives", queryValue: "Maldives"},
  {name:"Mali", queryValue: "Mali"},
  {name:"Malta", queryValue: "Malta"},
  {name:"Marshall Islands", queryValue: "Marshall Islands"},
  {name:"Martinique", queryValue: "Martinique"},
  {name:"Mauritania", queryValue: "Mauritania"},
  {name:"Mauritius", queryValue: "Mauritius"},
  {name:"Mayotte", queryValue: "Mayotte"},
  {name:"Mexico", queryValue: "Mexico"},
  {name:"Micronesia", queryValue: "Micronesia"},
  {name:"Moldova", queryValue: "Moldova"},
  {name:"Monaco", queryValue: "Monaco"},
  {name:"Mongolia", queryValue: "Mongolia"},
  {name:"Montenegro", queryValue: "Montenegro"},
  {name:"Montserrat", queryValue: "Montserrat"},
  {name:"Morocco", queryValue: "Morocco"},
  {name:"Mozambique", queryValue: "Mozambique"},
  {name:"Myanmar", queryValue: "Myanmar"},
  {name:"Namibia", queryValue: "Namibia"},
  {name:"Nauru", queryValue: "Nauru"},
  {name:"Nepal", queryValue: "Nepal"},
  {name:"Netherlands", queryValue: "Netherlands"},
  {name:"New Caledonia", queryValue: "New Caledonia"},
  {name:"New Zealand", queryValue: "New Zealand"},
  {name:"Nicaragua", queryValue: "Nicaragua"},
  {name:"Niger", queryValue: "Niger"},
  {name:"Nigeria", queryValue: "Nigeria"},
  {name:"Niue", queryValue: "Niue"},
  {name:"Norfolk Island", queryValue: "Norfolk Island"},
  {name:"Northern Mariana Islands", queryValue: "Northern Mariana Islands"},
  {name:"Norway", queryValue: "Norway"},
  {name:"Oman", queryValue: "Oman"},
  {name:"Pakistan", queryValue: "Pakistan"},
  {name:"Palau", queryValue: "Palau"},
  {name:"Palestinian Territory", queryValue: "Palestinian Territory"},
  {name:"Panama", queryValue: "Panama"},
  {name:"Papua New Guinea", queryValue: "Papua New Guinea"},
  {name:"Paraguay", queryValue: "Paraguay"},
  {name:"Peru", queryValue: "Peru"},
  {name:"Philippines", queryValue: "Philippines"},
  {name:"Pitcairn", queryValue: "Pitcairn"},
  {name:"Poland", queryValue: "Poland"},
  {name:"Portugal", queryValue: "Portugal"},
  {name:"Puerto Rico", queryValue: "Puerto Rico"},
  {name:"Qatar", queryValue: "Qatar"},
  {name:"Réunion", queryValue: "Réunion"},
  {name:"Romania", queryValue: "Romania"},
  {name:"Russia", queryValue: "Russia"},
  {name:"Rwanda", queryValue: "Rwanda"},
  {name:"S. Georgia and S. Sandwich", queryValue: "S. Georgia and S. Sandwich"},
  {name:"Saint Helena", queryValue: "Saint Helena"},
  {name:"Saint Lucia", queryValue: "Saint Lucia"},
  {name:"Saint Martin", queryValue: "Saint Martin"},
  {name:"Saint Pierre and Miquelon", queryValue: "Saint Pierre and Miquelon"},
  {name:"Saint-Barthélemy", queryValue: "Saint-Barthélemy"},
  {name:"Samoa", queryValue: "Samoa"},
  {name:"San Marino", queryValue: "San Marino"},
  {name:"Sao Tomé and Principe", queryValue: "Sao Tomé and Principe"},
  {name:"Saudi Arabia", queryValue: "Saudi Arabia"},
  {name:"Senegal", queryValue: "Senegal"},
  {name:"Serbia", queryValue: "Serbia"},
  {name:"Seychelles", queryValue: "Seychelles"},
  {name:"Sierra Leone", queryValue: "Sierra Leone"},
  {name:"Singapore", queryValue: "Singapore"},
  {name:"Sint Maarten", queryValue: "Sint Maarten"},
  {name:"Slovakia", queryValue: "Slovakia"},
  {name:"Slovenia", queryValue: "Slovenia"},
  {name:"Solomon Islands", queryValue: "Solomon Islands"},
  {name:"Somalia", queryValue: "Somalia"},
  {name:"South Africa", queryValue: "South Africa"},
  {name:"South Sudan", queryValue: "South Sudan"},
  {name:"Spain", queryValue: "Spain"},
  {name:"Sri Lanka", queryValue: "Sri Lanka"},
  {name:"St. Kitts and Nevis", queryValue: "St. Kitts and Nevis"},
  {name:"St. Vincent and Grenadines", queryValue: "St. Vincent and Grenadines"},
  {name:"Sudan", queryValue: "Sudan"},
  {name:"Suriname", queryValue: "Suriname"},
  {name:"Svalbard and Jan Mayen", queryValue: "Svalbard and Jan Mayen"},
  {name:"Swaziland", queryValue: "Swaziland"},
  {name:"Sweden", queryValue: "Sweden"},
  {name:"Switzerland", queryValue: "Switzerland"},
  {name:"Syria", queryValue: "Syria"},
  {name:"Taiwan", queryValue: "Taiwan"},
  {name:"Tajikistan", queryValue: "Tajikistan"},
  {name:"Tanzania", queryValue: "Tanzania"},
  {name:"Thailand", queryValue: "Thailand"},
  {name:"Timor-Leste", queryValue: "Timor-Leste"},
  {name:"Togo", queryValue: "Togo"},
  {name:"Tokelau", queryValue: "Tokelau"},
  {name:"Tonga", queryValue: "Tonga"},
  {name:"Trinidad and Tobago", queryValue: "Trinidad and Tobago"},
  {name:"Tunisia", queryValue: "Tunisia"},
  {name:"Turkey", queryValue: "Turkey"},
  {name:"Turkmenistan", queryValue: "Turkmenistan"},
  {name:"Turks and Caicos Is.", queryValue: "Turks and Caicos Is."},
  {name:"Tuvalu", queryValue: "Tuvalu"},
  {name:"Uganda", queryValue: "Uganda"},
  {name:"Ukraine", queryValue: "Ukraine"},
  {name:"United Arab Emirates", queryValue: "United Arab Emirates"},
  {name:"United Kingdom", queryValue: "United Kingdom"},
  {name:"United States Minor Outlying Islands", queryValue: "United States Minor Outlying Islands"},
  {name:"United States of America", queryValue: "United States of America"},
  {name:"United States Virgin Islands", queryValue: "United States Virgin Islands"},
  {name:"Uruguay", queryValue: "Uruguay"},
  {name:"Uzbekistan", queryValue: "Uzbekistan"},
  {name:"Vanuatu", queryValue: "Vanuatu"},
  {name:"Vatican City", queryValue: "Vatican City"},
  {name:"Venezuela", queryValue: "Venezuela"},
  {name:"Viet Nam", queryValue: "Viet Nam"},
  {name:"Virgin Islands, British", queryValue: "Virgin Islands, British"},
  {name:"Wallis and Futuna", queryValue: "Wallis and Futuna"},
  {name:"Western Sahara", queryValue: "Western Sahara"},
  {name:"Yemen", queryValue: "Yemen"},
  {name:"Zambia", queryValue: "Zambia"},
  {name:"Zimbabwe", queryValue: "Zimbabwe"}
];
