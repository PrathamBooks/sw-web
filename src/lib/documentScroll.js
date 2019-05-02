export const disableDocumentScroll = () => {
  const currentScrollPos = window.pageYOffset;

  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.position = 'fixed';
  document.documentElement.style.width = '100%';

  // Since 'position: fixed' is needed to disable scroll on mobiles,
  // we are positioning the the the document using the current scroll position.
  document.documentElement.style.top = `-${currentScrollPos}px`;
};

export const enableDocumentScroll = () => {
  const currentScrollPos = parseInt(document.documentElement.style.top, 10);

  document.documentElement.style.overflow = '';
  document.documentElement.style.position = '';
  document.documentElement.style.width = '';
  document.documentElement.style.top = '';

  if (currentScrollPos) {
    window.scrollTo(0, currentScrollPos * -1);
  }
};
