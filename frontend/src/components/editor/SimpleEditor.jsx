import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Quote, Code } from 'lucide-react';

export default function SimpleEditor({ content, onChange, placeholder }) {
    const editorRef = useRef(null);

    // Sync initial content
    useEffect(() => {
        if (editorRef.current && content && editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
        }
    }, []);

    const handleInput = (e) => {
        onChange(e.currentTarget.innerHTML);
    };

    const exec = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();
    };

    const ToolbarButton = ({ onClick, icon: Icon, active = false }) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`p-2 rounded hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white ${active ? 'bg-zinc-700 text-white' : ''}`}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="simple-editor-container border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-[500px]">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50">
                <ToolbarButton onClick={() => exec('bold')} icon={Bold} />
                <ToolbarButton onClick={() => exec('italic')} icon={Italic} />
                <ToolbarButton onClick={() => exec('underline')} icon={Underline} />
                <div className="w-[1px] h-6 bg-zinc-800 mx-1"></div>
                <ToolbarButton onClick={() => exec('formatBlock', 'H1')} icon={Heading1} />
                <ToolbarButton onClick={() => exec('formatBlock', 'H2')} icon={Heading2} />
                <div className="w-[1px] h-6 bg-zinc-800 mx-1"></div>
                <ToolbarButton onClick={() => exec('insertUnorderedList')} icon={List} />
                <ToolbarButton onClick={() => exec('insertOrderedList')} icon={ListOrdered} />
                <ToolbarButton onClick={() => exec('formatBlock', 'blockquote')} icon={Quote} />
                <ToolbarButton onClick={() => exec('formatBlock', 'pre')} icon={Code} />
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                className="flex-1 p-6 outline-none overflow-y-auto prose prose-invert max-w-none"
                contentEditable
                onInput={handleInput}
                style={{ minHeight: '300px' }}
                placeholder={placeholder}
            />

            <div className="px-4 py-2 bg-zinc-900/30 text-xs text-zinc-500 border-t border-zinc-800 text-right">
                Custom Editor (Safe Mode) &bull; Tiptap Unavailable
            </div>

            <style>{`
        [contentEditable]:empty:before {
          content: attr(placeholder);
          color: #52525b;
          cursor: text;
        }
        /* Basic Styling for Content */
        .prose h1 { font-size: 2em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.5em; color: white; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.5em; color: white; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
        .prose ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
        .prose blockquote { border-left: 4px solid #6366f1; padding-left: 1em; margin: 1em 0; color: #a1a1aa; background: #1f1f22; padding: 0.5em 1em; border-radius: 0 4px 4px 0; }
        .prose pre { background: #18181b; padding: 1em; border-radius: 8px; font-family: monospace; margin: 1em 0; color: #ef4444; }
      `}</style>
        </div>
    );
}
