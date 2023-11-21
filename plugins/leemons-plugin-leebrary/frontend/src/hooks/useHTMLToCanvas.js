import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

const useHTMLToCanvas = (ref) => {
  const [canvasImage, setCanvasImage] = useState();
  const renderCanvas = async () => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current);
      const response = canvas.toDataURL('image/png');
      setCanvasImage(response);
    }
  };
  useEffect(() => {
    renderCanvas();
  }, [ref.current]);
  return { canvasImage };
};

export { useHTMLToCanvas };
export default useHTMLToCanvas;
