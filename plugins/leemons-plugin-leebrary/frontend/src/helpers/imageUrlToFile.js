async function imageUrlToFile(url) {
  const response = await fetch(`${leemons.allOriginsUrl}/get?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Network response was not ok.');
  const data = await response.json();

  return new Promise((resolve) => {
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
  });
}

export default imageUrlToFile;
export { imageUrlToFile };
