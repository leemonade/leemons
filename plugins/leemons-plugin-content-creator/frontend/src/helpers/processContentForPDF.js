function processContentForPDF(content, t) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const libraryElements = tempDiv.getElementsByTagName('library');

  Array.from(libraryElements).forEach((element) => {
    const fileType = element.getAttribute('filetype');
    const display = element.getAttribute('display');
    const url = element.getAttribute('url');

    let shouldReplace = false;

    if (
      fileType === 'audio' ||
      fileType === 'video' ||
      fileType === 'bookmark' ||
      (fileType === 'image' && display === 'embed')
    ) {
      shouldReplace = true;
    }

    if (shouldReplace) {
      const replacement = document.createElement('div');

      let content = `<library-non-printable message="${t('contentTypeNotSupported', { type: fileType })}"></library-non-printable>`;
      if (fileType === 'bookmark' && url) {
        content += `<library-non-printable link="${url}" message="${t('contentTypeNotSupportedWithLink', { type: fileType })}"></library-non-printable>`;
      }

      replacement.innerHTML = content;
      element.parentNode.replaceChild(replacement, element);
    }
  });

  return tempDiv.innerHTML;
}

export { processContentForPDF };
