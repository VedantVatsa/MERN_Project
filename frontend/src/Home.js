import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Home.css";
function Home({ isAuthenticated }) {
  const [commentInputs, setCommentInputs] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://mern-backend-s5b5.onrender.com/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleLike = (postId) => {
    if (!isAuthenticated) {
      alert("You need to log in to like a post.");
      return;
    }

    axios
      .post(`https://mern-backend-s5b5.onrender.com/api/posts/like/${postId}`)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        );
        setPosts(updatedPosts);
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  const handleAddComment = (postId, commentText) => {
    if (!isAuthenticated) {
      alert("You need to log in to comment.");
      return;
    }

    axios
      .post(
        `https://mern-backend-s5b5.onrender.com/api/posts/comment/${postId}`,
        {
          text: commentText,
        }
      )
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        );
        setPosts(updatedPosts);
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(
        `https://mern-backend-s5b5.onrender.com/api/posts/${postId}`
      );
      console.log("Post deleted:", response.data);
      // Handle UI update or refresh after successful deletion
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error display or notification to the user
    }
  };
  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <div className="home">
      <h2>Recent Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.file && (
            <div>
              {post.file.includes(".mp4") ? (
                <video width="320" height="240" controls>
                  <source
                    src={`https://mern-backend-s5b5.onrender.com/uploads/${post.file}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`https://mern-backend-s5b5.onrender.com/uploads/${post.file}`}
                  alt="Post Media"
                />
              )}
            </div>
          )}
          <p>Likes: {post.likes}</p>
          <button onClick={() => handleLike(post._id)}>Like</button>
          <p>Comments: {post.comments.length}</p>
          <ul>
            {post.comments.map((comment, index) => (
              <li key={index}>{comment.text}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add a comment"
            className="comment-input"
            value={commentInputs[post._id] || ""}
            onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
          />
          <button
            onClick={() =>
              handleAddComment(post._id, commentInputs[post._id] || "")
            }
            className="comment-button"
          >
            Add Comment
          </button>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
