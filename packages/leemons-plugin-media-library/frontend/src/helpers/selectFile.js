import uploadFiles from '../request/uploadFiles';

export default function selectFile({ multiple }) {
  const input = document.createElement('input');
  input.type = 'file';
  if (multiple) input.multiple = true;
  input.onchange = async () => {
    try {
      console.log(input.files.constructor.name, typeof input.files[0].constructor.name);
      await uploadFiles(input.files);
    } catch (err) {
      console.error(err);
    }
  };
  input.click();
}
