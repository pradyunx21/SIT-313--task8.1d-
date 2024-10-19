import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";  
import { firestore, storage } from './firebase'; // Import initialized Firestore and Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage methods
import './NewPost.css';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image) {
      // Step 1: Create a storage reference for the image
      const storageRef = ref(storage, `images/${image.name}`);

      // Step 2: Start the image upload to Storage
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track the upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error("Image upload failed: ", error);
        },
        async () => {
          // Step 3: Get the download URL after the upload completes
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);

          // Step 4: Store the post data in Firestore with the image URL
          try {
            await addDoc(collection(firestore, 'posts'), {  
              title,
              content,
              imageUrl: downloadURL, // Save the image URL (not the image itself)
              timestamp: new Date(),
            });
            console.log("Post added successfully");
          } catch (error) {
            console.error("Error adding document: ", error);
          }

          // Reset form after successful submission
          setTitle('');
          setContent('');
          setImage(null);
          setProgress(0);
        }
      );
    } else {
      // If there's no image, store just the post content in Firestore
      try {
        await addDoc(collection(firestore, 'posts'), { 
          title,
          content,
          timestamp: new Date(),
        });
        console.log("Post without image added successfully");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      
      // Reset form after successful submission
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="NewPostBar">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Post</button>
      </form>
      <progress value={progress} max="100" />
    </div>
  );
}

export default NewPost;
