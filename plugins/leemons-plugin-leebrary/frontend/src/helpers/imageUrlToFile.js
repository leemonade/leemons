function imageUrlToFile(url) {
  return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(
      (data) =>
        new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.src = data.contents;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob) => {
              const file = new File([blob], 'cover', { type: 'image/png' });
              resolve(file);
            }, 'image/png');
          };
        })
    );
}

export default imageUrlToFile;
export { imageUrlToFile };
