import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, ThumbsUp, Reply, Send, Award, TrendingUp, Users, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('trending');
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [showNewPost, setShowNewPost] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/community/posts?filter=${filter}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(getDefaultPosts());
    }
  };

  const getDefaultPosts = () => [
    {
      id: 1,
      author: { name: 'Sarah Chen', avatar: '👩‍💻', reputation: 1250 },
      title: 'How to approach Dynamic Programming problems?',
      content: 'I\'ve been struggling with DP problems. Any tips on how to identify patterns and build the solution?',
      tags: ['dynamic-programming', 'advice'],
      likes: 24,
      replies: 8,
      createdAt: '2 hours ago',
      hasReplies: true
    },
    {
      id: 2,
      author: { name: 'Alex Kumar', avatar: '👨‍💼', reputation: 890 },
      title: 'Passed Google L4 Interview - AMA',
      content: 'Just received my offer! Happy to answer questions about the interview process.',
      tags: ['google', 'interview-experience', 'ama'],
      likes: 156,
      replies: 34,
      createdAt: '5 hours ago',
      hasReplies: true
    },
    {
      id: 3,
      author: { name: 'Mike Johnson', avatar: '🧑‍💻', reputation: 450 },
      title: 'Best resources for System Design?',
      content: 'Looking for comprehensive system design resources. What worked for you?',
      tags: ['system-design', 'resources'],
      likes: 42,
      replies: 15,
      createdAt: '1 day ago',
      hasReplies: true
    },
    {
      id: 4,
      author: { name: 'Lisa Wang', avatar: '👩‍🔬', reputation: 2100 },
      title: 'Common mistakes in behavioral interviews',
      content: 'After conducting 100+ interviews, here are the top mistakes I see candidates make...',
      tags: ['behavioral', 'interview-tips'],
      likes: 89,
      replies: 21,
      createdAt: '2 days ago',
      hasReplies: true
    }
  ];

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('/api/community/posts', newPost);
      setNewPost({ title: '', content: '', tags: [] });
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(`/api/community/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const submitReply = async (postId) => {
    if (!replyContent.trim()) return;

    try {
      await axios.post(`/api/community/posts/${postId}/reply`, {
        content: replyContent
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchPosts();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const popularTags = [
    'dynamic-programming', 'system-design', 'interview-tips',
    'google', 'amazon', 'facebook', 'binary-search',
    'graphs', 'trees', 'arrays'
  ];

  return (
    <div className="container" style={{ maxWidth: '1400px', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '15px', color: '#1e293b' }}>
          Community Forum
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b' }}>
          Connect with fellow engineers, share experiences, and learn together
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Users size={32} style={{ color: '#3b82f6', margin: '0 auto 10px' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>
            5,234
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Active Members</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <MessageSquare size={32} style={{ color: '#10b981', margin: '0 auto 10px' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>
            1,482
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Discussions</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Award size={32} style={{ color: '#f59e0b', margin: '0 auto 10px' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>
            342
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Success Stories</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['trending', 'recent', 'popular'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '10px 20px',
                    background: filter === f ? '#3b82f6' : 'white',
                    color: filter === f ? 'white' : '#64748b',
                    border: `1px solid ${filter === f ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {user && (
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                style={{
                  padding: '10px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                + New Post
              </button>
            )}
          </div>

          {showNewPost && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Create New Post</h3>
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  marginBottom: '15px',
                  outline: 'none'
                }}
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  marginBottom: '15px',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  Add tags: {popularTags.slice(0, 3).join(', ')}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowNewPost(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPost}
                    style={{
                      padding: '10px 20px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map(post => (
              <div
                key={post.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {post.author.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>
                        {post.author.name}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {post.author.reputation} rep
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                        • {post.createdAt}
                      </span>
                    </div>
                    <h3 style={{ color: '#1e293b', marginBottom: '10px', fontSize: '18px' }}>
                      {post.title}
                    </h3>
                    <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '15px' }}>
                      {post.content}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: '#eff6ff',
                            color: '#3b82f6',
                            borderRadius: '6px',
                            fontSize: '13px'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <button
                        onClick={() => likePost(post.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#475569'
                        }}
                      >
                        <ThumbsUp size={16} />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#475569'
                        }}
                      >
                        <MessageSquare size={16} />
                        {post.replies} replies
                      </button>
                    </div>

                    {replyingTo === post.id && (
                      <div style={{ marginTop: '20px' }}>
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            marginBottom: '10px',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setReplyingTo(null)}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              color: '#64748b',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => submitReply(post.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Send size={14} />
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '16px' }}>
              Popular Tags
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#475569',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#eff6ff';
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.color = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.color = '#475569';
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '16px' }}>
              Top Contributors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { name: 'Emily Davis', rep: 3420, avatar: '👩‍💻' },
                { name: 'Chris Lee', rep: 2890, avatar: '👨‍💼' },
                { name: 'Sam Taylor', rep: 2650, avatar: '🧑‍💻' },
                { name: 'Jordan Smith', rep: 2100, avatar: '👨‍🔬' }
              ].map((contributor, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {contributor.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '14px' }}>
                      {contributor.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      {contributor.rep} reputation
                    </div>
                  </div>
                  <Award size={16} style={{ color: '#f59e0b' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
