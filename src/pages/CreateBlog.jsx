import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Loader, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(''); // URL for now
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title || !content) return alert("Title and content are required");
    
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Simple token auth
        },
        body: JSON.stringify({
          title,
          content, // Sending raw text/html for now
          cover_image: coverImage,
          category
        })
      });

      if (response.ok) {
        navigate('/blog');
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  // Notion-style Minimalist Editors often just use a clean textarea that auto-expands
  // For a reliable "contenteditable" feel without a heavy library, we can style a textarea.

  return (
    <div style={{ minHeight: '100vh', background: '#030303', color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar - Minimalist */}
      <header style={{ 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px', 
        borderBottom: '1px solid var(--zinc-800)',
        position: 'sticky',
        top: 0,
        background: 'rgba(3,3,3,0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <button onClick={() => navigate('/blog')} style={{ background: 'none', border: 'none', color: 'var(--zinc-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <ArrowLeft size={16} /> Back
           </button>
           <div style={{ fontSize: '14px', color: 'var(--zinc-500)' }}>Draft / {user?.fullName || 'Untitled'}</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handlePublish}
            disabled={saving}
            style={{ height: '32px', fontSize: '13px', padding: '0 16px' }}
          >
            {saving ? <Loader size={14} className="animate-spin" /> : 'Publish'}
          </button>
        </div>
      </header>
      
      {/* Editor Container - Narrow centered column like Notion */}
      <main style={{ flex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '60px 24px', position: 'relative' }}>
        
        {/* Cover Image Placeholder */}
        {!coverImage ? (
           <button 
             onClick={() => {
                const url = prompt("Enter cover image URL (e.g., Unsplash link):");
                if (url) setCoverImage(url);
             }}
             style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '8px', 
               color: 'var(--zinc-500)', 
               background: 'none', 
               border: 'none', 
               cursor: 'pointer', 
               fontSize: '14px',
               marginBottom: '40px',
               padding: '8px 12px',
               borderRadius: '6px'
             }}
             onMouseEnter={e => e.target.style.background = 'var(--zinc-900)'}
             onMouseLeave={e => e.target.style.background = 'none'}
           >
             <ImageIcon size={16} /> Add Cover
           </button>
        ) : (
          <div style={{ position: 'relative', marginBottom: '40px', group: 'cover' }}>
            <img src={coverImage} alt="Cover" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
            <button 
              onClick={() => setCoverImage('')}
              style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontSize: '42px',
            fontWeight: 'bold',
            color: 'white',
            outline: 'none',
            marginBottom: '24px',
            fontFamily: 'inherit'
          }}
        />

        {/* Category Selector (Simple) */}
         <div style={{ marginBottom: '40px', display: 'flex', gap: '12px' }}>
            {['System Design', 'DSA', 'AI/ML', 'Career', 'General'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setCategory(cat)}
                 style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: 'none',
                    background: category === cat ? 'var(--zinc-800)' : 'transparent',
                    color: category === cat ? 'white' : 'var(--zinc-500)',
                    cursor: 'pointer'
                 }}
               >
                 {cat}
               </button>
            ))}
         </div>

        {/* Content Editor */}
        <textarea
          placeholder="Type '/' for commands..."
          value={content}
          onChange={(e) => {
             setContent(e.target.value);
             e.target.style.height = 'auto';
             e.target.style.height = e.target.scrollHeight + 'px';
          }}
          style={{
            width: '100%',
            minHeight: '400px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            lineHeight: '1.6',
            color: 'var(--zinc-300)',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            overflow: 'hidden'
          }}
        />

      </main>
    </div>
  );
}
