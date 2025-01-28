import { useState } from 'react';

const uploadFile = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
};

const Upload = () => {
    const [uploading, setUploading] = useState(false);

    return (
        <>
            <h2>Upload</h2>
            <input type="file" />
            <input type="text" placeholder="Title" />

            <button
                onClick={() => {
                    setUploading(true);
                    uploadFile().finally(() => setUploading(false));
                }}
            >Upload
            </button>
            {uploading && <p>Uploading...</p>}
            {uploading && <progress />}
        </>
    );
};

export default Upload;