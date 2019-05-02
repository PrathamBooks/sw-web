importScripts('workbox-sw.prod.js', 'workbox-google-analytics.prod.js', 'localforage.js');

const workboxSW = new WorkboxSW({ clientsClaim: true });

workbox.googleAnalytics.initialize();

const offlineBooksStore = localforage.createInstance({
  name: 'sw',
  storeName: 'offline-books'
});

const imageStore = localforage.createInstance({
  name: 'sw',
  storeName: 'images'
});

const getUnsizedUrl = (url) => {
  return url.replace( /size.*\//gi ,'')
}

const saveUrlOffline = (url, useUnsizedUrlKey = false) => {
  const key = useUnsizedUrlKey ? getUnsizedUrl(url) : url
  return fetch(url)
    .then(response => response.blob())
    .then(blob => imageStore.setItem(key, blob))
}

const saveImagesOffline = (contents, imageSize) => {
  const imagesUrls = contents.data.pages.map(page => {
    if (page.coverImage) {
      return page.coverImage.sizes[imageSize - 1].url
    } else {
      return null
    }
  })

  const imagePromises = imagesUrls
    .filter(imageUrl => imageUrl) // Filter out nulls
    .map((imageUrl) => saveUrlOffline(imageUrl, true))

  return Promise.all(imagePromises)
}

const saveAudioAssetsOffline = (contents) => {
  if (contents.data.isAudio) {
    saveUrlOffline(contents.data.vttFilePath)
    saveUrlOffline(contents.data.coverAudioPath)
    saveUrlOffline(contents.data.audioPath)
  }
}

workboxSW.router.registerRoute('/offline-books/:slug&imageSize=:imageSize', (args) => {
  const slug = args.params.slug
  const imageSize = args.params.imageSize

  const fetchStory = (slug) => fetch(`/api/v1/stories/${slug}`).then(response => response.json())
  const fetchStoryContents = (slug) => fetch(`/api/v1/stories/${slug}/read`).then(response => response.json())

  return Promise.all([ fetchStory(slug), fetchStoryContents(slug) ])
    .then(result => {
      const [ details, contents ] = result
      return Promise.all([
        offlineBooksStore.setItem(slug, {
          details: details,
          contents: contents
        }),
        saveAudioAssetsOffline(contents),
        saveImagesOffline(contents, imageSize),
        saveUrlOffline(details.data.coverImage.sizes[imageSize - 1].url, true),
        saveUrlOffline(contents.data.css),
        saveUrlOffline(contents.data.levelBand),
        saveUrlOffline(contents.data.publisherLogo)
      ])
      .then(result => new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .catch(err => new Response(JSON.stringify({ ok: false }), { status: 500 }));
    })

}, 'POST')

workboxSW.router.registerRoute('/api/v1/stories/:slug', (args) => {
  const slug = args.params.slug
  const request = args.event.request
  return offlineBooksStore.getItem(slug)
    .then(result => {
      if (result) {
        return new Response(JSON.stringify(result.details), { status: 200 })
      } else {
        return fetch(request)
      }
    })
}, 'GET')

workboxSW.router.registerRoute('/api/v1/stories/:slug/read', (args) => {
  const slug = args.params.slug
  const request = args.event.request
  return offlineBooksStore.getItem(slug)
    .then(result => {
      if (result) {
        return new Response(JSON.stringify(result.contents), { status: 200 })
      } else {
        return fetch(request)
      }
    })
}, 'GET')

/*
Listens to requests from below sample paths:
1. Google cloud storage URLs
2. Level bands path 
  {SITE_URL}/assets/level_bands/Level_2_English-7bdf246d0bd87aaa5fe29af2055b91c3.png
3. Book reader css path
  {SITE_URL}/assets/api/reader-46539bdc3add44066bc2687464ccbf54.css
4. Cover image path
  {SITE_URL}/system/storyweaver-sw2-full/illustration_crops/44162/f163ff16f31e642e61c4f6038db2fa34.jpg
SITE_URL can be https://dev.pbees.party, https://stage.pbees.party or https://storyweaver.org.in

^https: seems mandatory to add in regex otherwise not hitting the route
*/ 
workboxSW.router.registerRoute(
  /^https:\/\/storage.googleapis.com\/|^https:.*assets\/level_bands|^https:.*assets\/api|^https:.*\/system\//,
  (args) => {
    const url = args.url.href
    const request = args.event.request
    return imageStore.getItem(getUnsizedUrl(url))
      .then(result => {
        if (result) {
          return new Response(result, { status: 200 })
        } else {
          return fetch(request)
        }
      })
  }
)

workboxSW.router.registerNavigationRoute('index.html', {
  blacklist: [
    new RegExp('^/v0'),
    new RegExp('^/about'),
    new RegExp('^/story_weaver_and_you'),
    new RegExp('^/campaign'),
    new RegExp('^/our_partners'),
    new RegExp('^/volunteer'),
    new RegExp('^/prathambooks'),
    new RegExp('^/open_content'),
    new RegExp('^/tutorials'),
    new RegExp('^/uploading_an_illustration'),
    new RegExp('^/writing_a_story'),
    new RegExp('^/translation_tools_and_tips'),
    new RegExp('^/community_guidelines'),
    new RegExp('^/reading_levels'),
    new RegExp('^/terms_and_conditions'),
    new RegExp('^/privacy_policy'),
    new RegExp('^/disclaimer'),
    new RegExp('^/press'),
    new RegExp('^/picture_gallery'),
    new RegExp('^/contact'),
    new RegExp('^/careers'),
    new RegExp('^/feedback_and_comments'),
    new RegExp('^/faqs'),
    new RegExp('^/attributions'),
    new RegExp('^/past_campaigns'),
    new RegExp('^/weave_a_story_campaign'),
    new RegExp('^/wonder_why_week'),
    new RegExp('^/freedom_to_read'),
    new RegExp('^/blog'),
    new RegExp('^/phonestories'),
    new RegExp('^/phonestories/watchout'),
    new RegExp('^/users/sign_in'),
    new RegExp('^/users/sign_up'),
    new RegExp('^/users/auth'),
    new RegExp('^/users/sign_out'),
    new RegExp('^/users/password'),
    new RegExp('^/users/confirmation'),
    new RegExp('^/manifest.json'),
    new RegExp('^/ckeditor/pictures'),
    new RegExp('^/blog/search'),
    new RegExp('^/blog/dashboard'),
    new RegExp('^/blog/drafts'),
    new RegExp('^/blog/scheduled_posts'),
    new RegExp('^/blog/de_activated'),
    new RegExp('^/blog/new_comments'),
    new RegExp('^/blog_posts/autocomplete_tag_name'),
    new RegExp('^/blog_posts'),
    new RegExp('^/blog_posts/new'),
    new RegExp('^/blog_posts'),
    new RegExp('^/api'),
    new RegExp('^/assets/api'),
    new RegExp('^/assets/media/catalog.atom'),
    new RegExp('/in_the_news'),
    new RegExp('/archive'),
    new RegExp('/news_arch_*'),
    new RegExp('/phonestories/watchout'),
    new RegExp('/phonestories/did_you_hear'),
    new RegExp('/phonestories/wild_cat'),
    new RegExp('/phonestories2'),
    new RegExp('/phonestories2/miss_laya_fantastic_motorbike'),
    new RegExp('/phonestories2/miss_laya_fantastic_motorbike_hungry'),
    new RegExp('/phonestories2/miss_laya_fantastic_motorbike_big_boxcontests'),
    new RegExp('/stories/show-in-iframe'),
    new RegExp('/imld'),
    new RegExp('/imld_faqs')
  ]
});

const networkFirst = workboxSW.strategies.networkFirst()
const staleWhileRevalidate = workboxSW.strategies.staleWhileRevalidate()

// TODO: Below paths should be replaceable with single path
// Cache the Google Fonts webfont files and Google Fonts stylesheets files
// workboxSW.router.registerRoute(/^https:\/\/fonts\.gstatic\.com|^https:\/\/fonts\.googleapis\.com/, networkFirst)

// Cache CSS for the fonts
workboxSW.router.registerRoute('https://fonts.googleapis.com/earlyaccess/notosansgujarati.css', networkFirst)
workboxSW.router.registerRoute('https://fonts.googleapis.com/css?family=Bree+Serif|Raleway:400,700', networkFirst)

// Cache font files requested by the CSS
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Regular.eot', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Regular.eot?#iefix', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Regular.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Regular.woff', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Regular.ttf', networkFirst)

workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Bold.eot', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Bold.eot?#iefix', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Bold.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Bold.woff', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/ea/notosansgujarati/v1/NotoSansGujarati-Bold.ttf', networkFirst)

workboxSW.router.registerRoute('https://fonts.gstatic.com/s/breeserif/v7/0daoUMW28nkWOnFz2G4AAgsYbbCjybiHxArTLjt7FRU.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/s/breeserif/v7/LQ7WLTaITDg4OSRuOZCpswzyDMXhdD8sAj6OAJTFsBI.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/s/raleway/v12/YZaO6llzOP57DpTBv2GnyFKPGs1ZzpMvnHX-7fPOuAc.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/s/raleway/v12/QAUlVt1jXOgQavlW5wEfxQLUuEpTyoUstqEm5AMlJo4.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/s/raleway/v12/WmVKXVcOuffP_qmCpFuyzQsYbbCjybiHxArTLjt7FRU.woff2', networkFirst)
workboxSW.router.registerRoute('https://fonts.gstatic.com/s/raleway/v12/JbtMzqLaYbbbCL9X6EvaIwzyDMXhdD8sAj6OAJTFsBI.woff2', networkFirst)

workboxSW.precache([]);

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});