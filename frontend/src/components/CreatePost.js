import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function CreatePost() {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [postSuccess, setPostSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handlePostSubmit = () => {
    const postData = {
      title: newPost.title,
      content: newPost.content,
    };

    const token = localStorage.getItem("token");

    axios
      .post("https://mern-backend-s5b5.onrender.com/api/posts", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNewPost({ title: "", content: "" });
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
      <button onClick={handlePostSubmit} className="submit-button">
        Post
      </button>
    </div>
  );
}

export default CreatePost;
