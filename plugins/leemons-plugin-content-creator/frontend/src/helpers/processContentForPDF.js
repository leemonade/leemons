function processContentForPDF(content) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const libraryElements = tempDiv.getElementsByTagName('library');

  Array.from(libraryElements).forEach((element) => {
    const fileType = element.getAttribute('filetype');
    const display = element.getAttribute('display');
    const url = element.getAttribute('url');

    let shouldReplace = false;

    if (fileType === 'audio' || fileType === 'video') {
      shouldReplace = true;
    } else if (fileType === 'bookmark') {
      shouldReplace = true;
    } else if (fileType === 'image' && display === 'embed') {
      shouldReplace = true;
    }

    // Si necesitamos reemplazar, creamos el nuevo elemento
    if (shouldReplace) {
      const replacement = document.createElement('div');
      replacement.className = 'non-printable-content';
      replacement.style.cssText =
        'border: 1px solid black !important; border-radius: 8px !important; padding: 10px !important; margin: 10px 0 !important; display: block !important; width: 100% !important;';

      let content =
        '<div style="border: 1px solid black"><h4><strong>+++++ Contenido no imprimible +++++</strong></h4></div>';
      if (fileType === 'bookmark' && url) {
        content += '<p style="margin-left: 0px !important"></p>';
        content += `<br>URL: ${url}`;
        content += '<p style="margin-left: 0px !important"></p>';
        content += `<br><img src="https://plus.unsplash.com/premium_photo-1663933533712-eef7095f782b?q=80&w=2693&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>`;
      }

      replacement.innerHTML = content;
      element.parentNode.replaceChild(replacement, element);
    }
  });

  return tempDiv.innerHTML;
}

export { processContentForPDF };
