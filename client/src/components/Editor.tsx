import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import Heading from '@tiptap/extension-heading';


interface EditorProps {    // defining the props for the Editor component
    socket: Socket;
    username: string;
}

// defining the Editor component
const Editor: React.FC<EditorProps> = ({ socket, username }) => {

    const [typingUser, setTypingUser] = useState<string | null>(null); // state to manage the typing user
    const [LastEdited, setLastEdited] = useState<string | null>(null); // state to manage the last edited user
    const [Highlight, setHighlight] = useState(false); // state to maintain the highlight of the last edited user

    // defining the editor using the useEditor hook
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none min-h-[180px] w-full',
                spellcheck: 'false',
                autocorrect: 'off',
            },
        },
        onUpdate({ editor }) {
            const html = editor.getHTML();
            socket.emit('send-changes', { html, username });     //defining the send-changes event
            socket.emit('typing', username);      //defining the typing event
        },
    });

    // useEffect to handle the typing event
    useEffect(() => {
        socket.on('typing', (name: string) => {
            if (name !== username) {
                setTypingUser(name);
                setTimeout(() => {
                    setTypingUser(null);
                }, 2000); // clear the typing user after 2 seconds
            }
        });
        return () => {
            socket.off('typing');
        }
    }, [username, socket])

    // useEffect to handle the socket events
    useEffect(() => {
        if (!editor) return;
        socket.on('receive-changes', (data: { html: string, username: string }) => {
            if (editor.getHTML() !== data.html) {
                editor.commands.setContent(data.html, false);
                setLastEdited(data.username); // set the last edited user
                setHighlight(true); // set the highlight to true
                setTimeout(() => {
                    setHighlight(false); // clear the highlight after 2 seconds
                    setLastEdited(null); // clear the last edited user
                }, 5000); // clear the highlight after 5 seconds
            }
        });
        socket.on("load-content", (html: string) => {
            editor.commands.setContent(html, false);
        })
        return () => {
            socket.off('receive-changes');
            socket.off('load-content');
        }
    }, [editor, socket])

    // Button click handlers
    const toggleHeading = (level: 1 | 2 | 3) => {
        editor?.chain().focus().toggleHeading({ level }).run();
    };
    const undo = () => {
        editor?.chain().focus().undo().run();
    };

    const redo = () => {
        editor?.chain().focus().redo().run();
    };
    const toggleBold = () => {
        editor?.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
        editor?.chain().focus().toggleItalic().run();
    };

    const toggleUnderline = () => {
        editor?.chain().focus().toggleUnderline().run();
    };

    const toggleBulletList = () => {
        editor?.chain().focus().toggleBulletList().run();
    };

    const toggleOrderedList = () => {
        editor?.chain().focus().toggleOrderedList().run();
    };

    const toggleCodeBlock = () => {
        editor?.chain().focus().toggleCodeBlock().run();
    };

    // Checking for active states to highlight buttons
    const isActive = (type: string, attrs?: Record<string, any>) => {
        if (!editor) return false;
        return editor.isActive(type, attrs);
    };

    return (
        <div>
            {/* toolbar */}
            <div className="flex flex-wrap gap-y-2 space-x-2 mb-4">
                <button onClick={undo} className="btn">Undo</button>
                <button onClick={redo} className="btn">Redo</button>
                <button onClick={() => toggleHeading(1)} className={`btn ${isActive('heading', { level: 1 }) ? 'bg-blue-200' : ''}`}>
                    H1
                </button>
                <button onClick={() => toggleHeading(2)} className={`btn ${isActive('heading', { level: 2 }) ? 'bg-blue-200' : ''}`}>
                    H2
                </button>
                <button onClick={() => toggleHeading(3)} className={`btn ${isActive('heading', { level: 3 }) ? 'bg-blue-200' : ''}`}>
                    H3
                </button>
            </div>
            <div className="flex flex-wrap gap-y-2 space-x-2 mb-4">
                <button
                    onClick={toggleBold}
                    className={`btn ${isActive('bold') ? 'bg-blue-200' : ''}`}
                >
                    Bold
                </button>
                <button
                    onClick={toggleItalic}
                    className={`btn ${isActive('italic') ? 'bg-blue-200' : ''}`}
                >
                    Italic
                </button>
                <button
                    onClick={toggleUnderline}
                    className={`btn ${isActive('underline') ? 'bg-blue-200' : ''}`}
                >
                    Underline
                </button>
                <button
                    onClick={toggleBulletList}
                    className={`btn ${isActive('bulletList') ? 'bg-blue-200' : ''}`}
                >
                    • Bullets
                </button>
                <button
                    onClick={toggleOrderedList}
                    className={`btn ${isActive('orderedList') ? 'bg-blue-200' : ''}`}
                >
                    1. Numbered
                </button>
                <button
                    onClick={toggleCodeBlock}
                    className={`btn ${isActive('codeBlock') ? 'bg-blue-200' : ''}`}
                >
                    Code
                </button>
            </div>
            {/* last edited user */}
            {LastEdited && (
                <div className="text-gray-500 text-sm mb-2">
                    ✍️ Last edited by <span className='font-medium'>{LastEdited}</span>
                </div>
            )}
            {/* editor */}
            <div className='relative w-full max-w-4xl mx-auto'>
                {editor && !editor.getText().length && (
                    <div className="absolute text-gray-400 pointer-events-none p-4">
                        Start typing here…
                    </div>
                )}
                <div className={`transition-all duration-300 rounded border-2 p-4 ${Highlight ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'
                    }`}>
                    <EditorContent editor={editor}/>
                </div>
            </div>
            {/* typing user */}
            {typingUser && (
                <div className="text-gray-500 text-sm mt-2">
                    {typingUser} is typing...
                </div>
            )}
        </div>
    )
}

export default Editor