// Upload.tsx
import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from '../hooks/formHooks';
import { useFile, useMedia } from '../hooks/apiHooks';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { postFile } = useFile();
  const { postMedia } = useMedia();

  const initValues = {
    title: '',
    description: '',
  };

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);
    }
  };

  const doUpload = async () => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!file || !token) {
        throw new Error('No file selected');
      }
      const fileResult = await postFile(file, token);
      await postMedia(fileResult, inputs, token);
      setUploadResult('Upload successful');
      resetForm();
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const { handleSubmit, handleInputChange, inputs, setInputs } = useForm(doUpload, initValues);

  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    if (fileRef.current) {
      console.log(fileRef.current);
      fileRef.current.value = '';
    }
  };

  return (
    <>
      {uploadResult ? (
        <>
          <h1>{uploadResult}</h1>
        </>
      ) : (
        <div className="flex flex-col items-center p-4">
          {uploading ? (
            <h1>Uploading...</h1>
          ) : (
            <>
              <h1>Upload</h1>
              <form onSubmit={handleSubmit}>
                <div className="my-2 flex flex-col">
                  <label htmlFor="title">Title</label>
                  <input
                    name="title"
                    type="text"
                    id="title"
                    onChange={handleInputChange}
                    value={inputs.title}
                    className="my-2 rounded-sm border-2 border-stone-500"
                  />
                </div>
                <div className="my-2 flex flex-col">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    rows={5}
                    id="description"
                    onChange={handleInputChange}
                    value={inputs.description}
                    className="my-2 rounded-sm border-2 border-stone-500"
                  ></textarea>
                </div>
                <div className="my-2">
                  <label htmlFor="file">File</label>
                  <input
                    name="file"
                    type="file"
                    id="file"
                    accept="image/*, video/*"
                    onChange={handleFileChange}
                    className="mx-2"
                  />
                </div>
                <img
                  src={
                    file ? URL.createObjectURL(file) : 'https://place-hold.it/200?text=Choose+image'
                  }
                  alt="preview"
                  width="200"
                  className="my-2"
                />
                <button type="submit" disabled={file && inputs.title.length > 3 ? false : true}>
                  Upload
                </button>
                <button type="button" onClick={resetForm}>
                  Reset
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Upload;
