"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useState } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Code2,
} from "lucide-react"

function ToolbarButton({ onClick, isActive, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        isActive
          ? "bg-accent-purple/15 text-accent-purple"
          : "text-text-muted hover:bg-gray-100 hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-6 w-px shrink-0 bg-border" />
}

export default function RichTextEditor({ content, onChange }) {
  const [mode, setMode] = useState("visual")
  const [htmlValue, setHtmlValue] = useState(content || "")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: true, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start writing your post content…",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlValue(html)
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: "ProseMirror",
      },
    },
  })

  // Sync editor content when prop changes
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || "", false)
      setHtmlValue(content || "")
    }
  }, [editor, content])

  if (!editor) return null

  const addImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  function handleHtmlChange(e) {
    const val = e.target.value
    setHtmlValue(val)
    onChange?.(val)
  }

  function switchToVisual() {
    setMode("visual")
    // Re-set content when switching back to visual
    if (editor) {
      editor.commands.setContent(htmlValue || "", false)
    }
  }

  function switchToHtml() {
    setMode("html")
    // Sync html textarea with current editor content
    if (editor) {
      setHtmlValue(editor.getHTML())
    }
  }

  return (
    <div className="admin-editor overflow-hidden rounded-xl border border-border bg-white">
      {/* Mode toggle + Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-3 py-2">
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet list">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered list">
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Blockquote">
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code block">
            <Code size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={addImage} isActive={editor.isActive("image")} title="Insert image">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Insert link">
            <LinkIcon size={16} />
          </ToolbarButton>

          <div className="ml-2 flex gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} title="Undo">
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} title="Redo">
              <Redo size={16} />
            </ToolbarButton>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-gray-50 p-0.5">
          <button
            type="button"
            onClick={switchToVisual}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === "visual"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={switchToHtml}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === "html"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-1">
              <Code2 size={13} />
              HTML
            </span>
          </button>
        </div>
      </div>

      {/* Editor content */}
      {mode === "visual" ? (
        <div className="admin-editor">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          className="block w-full resize-y border-0 bg-white px-6 py-5 font-mono text-sm leading-relaxed text-text-primary placeholder:text-text-muted-2 focus:outline-none"
          style={{ minHeight: 520 }}
          placeholder="Paste or write HTML content here..."
        />
      )}
    </div>
  )
}
