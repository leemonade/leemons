export default function selectFile({ multiple } = {}) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (multiple) input.multiple = true;
    input.onchange = async () => {
      resolve(input.files);
    };
    input.click();
  });
}
