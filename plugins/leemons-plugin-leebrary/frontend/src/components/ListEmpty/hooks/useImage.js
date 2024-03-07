import { useEffect, useState } from 'react';

export function useImage(name) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    import(`@leebrary/assets/emptyStates/${name}.svg`).then((module) => setImage(module.default));
  }, [name]);

  return image;
}

export default useImage;
