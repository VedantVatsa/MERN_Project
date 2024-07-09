import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function CreatePost() {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [postSuccess, setPostSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleFileChange = (event) => {
    setNewPost({ ...newPost, file: event.target.files[0] });
  };

  const handlePostSubmit = () => {
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    formData.append("file", newPost.file);

    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNewPost({ title: "", content: "", file: null });
        setPostSuccess(true);
        setTimeout(() => {
          setPostSuccess(false);
        }, 3000); // Hide the success message after 3 seconds
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  return (
    <div className="create-post">
      <h2>Create a Post</h2>
      {postSuccess && (
        <p className="success-message">Post created successfully!</p>
      )}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newPost.title}
        onChange={handleInputChange}
        className="input-field"
      />
      <textarea
        name="content"
        placeholder="Content"
        value={newPost.content}
        onChange={handleInputChange}
        className="input-field"
      ></textarea>
      <input
        type="file"
        name="file"
        onChange={handleFileChange}
        className="file-input"
      />
      <button onClick={handlePostSubmit} className="submit-button">
        Post
      </button>
    </div>
  );
}

export default CreatePost;
