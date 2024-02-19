import { STATE_CHANGED, auth, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import Loader from './Loader';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e: any) => {
    const file = Array.from(e.target.files)[0] as Blob;
    const extension = file.type.split('/')[1];

    const uid: any = auth.currentUser?.uid;
    const fileRef = ref(storage, `uploads/${uid}/${Date.now()}.${extension}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(STATE_CHANGED, (snapshot) => {
      const pct: any = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);
    });

    uploadTask
      .then(() => getDownloadURL(fileRef))
      .then((url: any) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className='box'>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className='btn'>
            📸 Upload Img
            <input
              type='file'
              onChange={uploadFile}
              accept='image/x-png,image/gif,image/jpeg'
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
