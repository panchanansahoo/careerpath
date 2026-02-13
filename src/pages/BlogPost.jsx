import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

export default function BlogPost() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/blog/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setBlog(data);
            } else {
                // Handle 404
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', background: '#030303', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!blog) return <div style={{ minHeight: '100vh', background: '#030303', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Blog not found.</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#030303', color: 'white', position: 'relative' }}>
            <CursorGlow />

            {/* Navbar Placeholder/Spacer since we have a fixed navbar */}
            <div style={{ height: '80px' }}></div>

            <article className="container" style={{ maxWidth: '800px', padding: '60px 20px 100px', position: 'relative', zIndex: 10 }}>
                <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--zinc-400)', marginBottom: '40px', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <div style={{ marginBottom: '20px', color: 'var(--accent)', fontWeight: 600 }}>{blog.category || 'General'}</div>

                <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.1, marginBottom: '32px', fontWeight: 700 }}>
                    {blog.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--zinc-800)', paddingBottom: '32px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Author Avatar */}
                        {blog.author?.avatar_url ? (
                            <img src={blog.author.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--zinc-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: 500, color: 'white' }}>{blog.author?.full_name || 'Anonymous'}</div>
                            <div style={{ fontSize: '13px', color: 'var(--zinc-500)', display: 'flex', gap: '12px' }}>
                                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{blog.read_time || 5} min read</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="icon-btn" title="Share"><Share2 size={20} /></button>
                        <button className="icon-btn" title="Save"><Bookmark size={20} /></button>
                    </div>
                </div>

                {blog.cover_image && (
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        style={{ width: '100%', borderRadius: '16px', marginBottom: '60px', border: '1px solid var(--zinc-800)' }}
                    />
                )}

                {/* Content Area - Render HTML/Markdown */}
                <div
                    className="blog-content"
                    style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--zinc-300)' }}
                    dangerouslySetInnerHTML={{ __html: blog.content }} // Assuming simplistic HTML content for now
                >
                </div>

            </article>
        </div>
    );
}
