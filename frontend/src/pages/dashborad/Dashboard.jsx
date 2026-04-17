import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const getPosts = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/posts", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    setPosts(res.data);
  };

  const addPost = async () => {
    if (!text.trim()) return;

    await axios.post(
      "http://localhost:5000/api/posts",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText("");
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);


  const [showComments, setShowComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const getComments = async (postId) => {
    const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
    setComments(res.data);
    setShowComments(postId);
  };

  const addComment = async (postId) => {
    if (!token) {
      return alert("need to login")
    }
    if (!commentText.trim()) {
      return alert("please add a comment")
    }
    await axios.post(
      `http://localhost:5000/api/comments/${postId}`,
      { text: commentText },
      {
        headers: {
          Authorization: localStorage.getItem("token") // ✅ FIX
        }
      }
    );

    setCommentText("");
    getComments(postId);
  };

  const toggleLike = async (postId) => {
    if (!token) {
      return alert("need to login")
    }
    const res = await axios.put(
      `http://localhost:5000/api/posts/like/${postId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
            ...p,
            likes: Array(res.data.likes).fill(0), // simple update
            liked: res.data.liked
          }
          : p
      )
    );
  };

  const toggleFollow = async (userId) => {
    if (!token) {
      return alert("need to login")
    }
    const res = await axios.put(
      `http://localhost:5000/api/auth/follow/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p.user._id === userId
          ? { ...p, isFollowing: res.data.isFollowing }
          : p
      )
    );
  };

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: "10px" }}>DevConnect Feed</h2>
      <div className="post-box">
        <input
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="postbtn" onClick={addPost}>Post</button>
      </div>

      <div className="feed">
        {posts.map((p) => (
          <div className="card" key={p._id}>
            <div  style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="user">
                <div className="avatar">A</div>
                <h4>{p.user?.name}</h4>
                <span>@{p.user?.username}</span>
              </div>

              {p.user?._id !== userId && (
                <span onClick={() => toggleFollow(p.user._id)}>
                  {p.isFollowing ? "✔ Following" : "➕ Follow"}
                </span>
              )}
            </div>
            <p className="content">{p.text}</p>
            <div className="actions">
              <span onClick={() => toggleLike(p._id)}>
                {p.likes?.includes(userId) ? "❤️" : "🤍"} {p.likes?.length || 0}
              </span>
              <span onClick={() => getComments(p._id)}>💬 Comment</span>
              {/* <span onClick={() => toggleFollow(p.user._id)}>
                {p.isFollowing ? "✔ Following" : "➕ Follow"}
              </span> */}

              <span>{new Date(p.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}</span>
            </div>
            {showComments === p._id && (
              <div className="comment-popup">
                <div className="popup-content">
                  <button className="closeIcon" onClick={() => setShowComments(null)}>X</button>
                  <h3>Comments</h3>
                  {/* Comment List */}
                  <div className="comment-list">
                    {comments.map((c) => (
                      <div key={c._id} className="comment-item">
                        <b>{c.user?.name}</b> @{c.user?.username}
                        <p>{c.text}</p>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="comment-input">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                    />
                    <button onClick={() => addComment(p._id)}>➤</button>
                  </div>
                  {/* Close */}

                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}