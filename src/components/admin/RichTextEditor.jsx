"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useRef, useState } from "react"
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

function ToolbarButton({ onClick, isActive, children, title, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg transition-colors ${
        isActive
          ? "bg-accent-purple/15 text-accent-purple"
          : dark
            ? "text-slate-300 hover:bg-white/10 hover:text-white"
            : "text-text-muted hover:bg-black/5 hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider({ dark }) {
  return <div className={`mx-1 h-6 w-px shrink-0 ${dark ? "bg-white/20" : "bg-border"}`} />
}

const BLOCK_TAGS = new Set([
  "article",
  "aside",
  "blockquote",
  "div",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
])

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"])

const COMPACT_CHILD_TAGS = new Set(["ol", "ul", "tbody", "thead", "tfoot", "tr"])

function formatHtmlForEditor(html) {
  if (!html || typeof window === "undefined") return html || ""

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html")

  function serializeAttributes(element) {
    return Array.from(element.attributes)
      .map((attr) => ` ${attr.name}="${attr.value}"`)
      .join("")
  }

  function isInlineNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return true
    if (node.nodeType !== Node.ELEMENT_NODE) return false

    const tag = node.tagName.toLowerCase()
    if (BLOCK_TAGS.has(tag)) return false

    return Array.from(node.childNodes).every(isInlineNode)
  }

  function serializeInline(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.replace(/\s+/g, " ")
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ""

    const tag = node.tagName.toLowerCase()
    const attrs = serializeAttributes(node)

    if (VOID_TAGS.has(tag)) {
      return `<${tag}${attrs}>`
    }

    const content = Array.from(node.childNodes).map(serializeInline).join("")
    return `<${tag}${attrs}>${content}</${tag}>`
  }

  function serializeBlock(node, depth = 0) {
    const indent = "  ".repeat(depth)

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, " ").trim()
      return text ? `${indent}${text}` : ""
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ""

    const tag = node.tagName.toLowerCase()
    const attrs = serializeAttributes(node)

    if (VOID_TAGS.has(tag)) {
      return `${indent}<${tag}${attrs}>`
    }

    if (tag === "pre") {
      return `${indent}<pre${attrs}>${node.innerHTML}</pre>`
    }

    const children = Array.from(node.childNodes).filter((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return child.textContent.trim().length > 0
      }

      return child.nodeType === Node.ELEMENT_NODE
    })

    if (children.length === 0) {
      return `${indent}<${tag}${attrs}></${tag}>`
    }

    const inlineOnly = children.every(isInlineNode)

    if (inlineOnly) {
      const content = children.map(serializeInline).join("")
      return `${indent}<${tag}${attrs}>${content}</${tag}>`
    }

    const childJoiner = COMPACT_CHILD_TAGS.has(tag) ? "\n" : "\n\n"

    const serializedChildren = children
      .map((child) => serializeBlock(child, depth + 1))
      .filter(Boolean)
      .join(childJoiner)

    return `${indent}<${tag}${attrs}>\n${serializedChildren}\n${indent}</${tag}>`
  }

  return Array.from(doc.body.childNodes)
    .map((node) => serializeBlock(node, 0))
    .filter(Boolean)
    .join("\n\n")
}

export default function RichTextEditor({ content, onChange }) {
  const [mode, setMode] = useState("visual")
  const [htmlValue, setHtmlValue] = useState(content || "")
  const htmlLineNumbersRef = useRef(null)

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
      setHtmlValue(mode === "html" ? formatHtmlForEditor(content || "") : content || "")
    }
  }, [editor, content, mode])

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

  function handleHtmlScroll(e) {
    if (htmlLineNumbersRef.current) {
      htmlLineNumbersRef.current.scrollTop = e.target.scrollTop
    }
  }

  function formatCurrentHtml() {
    const formatted = formatHtmlForEditor(htmlValue)
    setHtmlValue(formatted)
    onChange?.(formatted)
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
      setHtmlValue(formatHtmlForEditor(editor.getHTML()))
    }
  }

  const htmlLineCount = Math.max(1, htmlValue.split("\n").length)
  const htmlLineNumbers = Array.from({ length: htmlLineCount }, (_, index) => index + 1)

  return (
    <div className={`admin-editor overflow-hidden rounded-xl border border-border bg-white ${mode === "html" ? "admin-editor-html-mode" : ""}`}>
      {/* Mode toggle + Toolbar */}
      <div className="admin-editor-toolbar flex items-center justify-between border-b border-border bg-white px-3 py-2">
        <div className="flex items-center gap-0.5">
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough size={16} />
          </ToolbarButton>

          <ToolbarDivider dark={mode === "html"} />

          <ToolbarButton dark={mode === "html"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </ToolbarButton>

          <ToolbarDivider dark={mode === "html"} />

          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet list">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered list">
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Blockquote">
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code block">
            <Code size={16} />
          </ToolbarButton>

          <ToolbarDivider dark={mode === "html"} />

          <ToolbarButton dark={mode === "html"} onClick={addImage} isActive={editor.isActive("image")} title="Insert image">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton dark={mode === "html"} onClick={addLink} isActive={editor.isActive("link")} title="Insert link">
            <LinkIcon size={16} />
          </ToolbarButton>

          <div className="ml-2 flex gap-0.5">
            <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().undo().run()} isActive={false} title="Undo">
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton dark={mode === "html"} onClick={() => editor.chain().focus().redo().run()} isActive={false} title="Redo">
              <Redo size={16} />
            </ToolbarButton>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="admin-editor-mode-toggle" style={mode === "html" ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" } : undefined}>
          <button
            type="button"
            onClick={switchToVisual}
            className={`admin-editor-mode-button rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === "visual"
                ? "bg-white text-text-primary shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={switchToHtml}
            className={`admin-editor-mode-button rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === "html"
                ? "bg-accent-purple/15 text-accent-purple shadow-sm"
                : "text-text-muted hover:bg-black/5 hover:text-text-primary"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5 text-center">
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
        <div className="admin-editor-html-shell">
          <div className="admin-editor-html-meta">
            <div className="admin-editor-html-meta-text">
              <span>HTML Source</span>
              <span>Changes here sync back to the visual editor</span>
            </div>
            <button
              type="button"
              onClick={formatCurrentHtml}
              className="admin-editor-format-button"
            >
              Format HTML
            </button>
          </div>
          <div className="admin-editor-html-pane">
            <div ref={htmlLineNumbersRef} className="admin-editor-html-gutter" aria-hidden="true">
              {htmlLineNumbers.map((lineNumber) => (
                <div key={lineNumber} className="admin-editor-html-gutter-line">
                  {lineNumber}
                </div>
              ))}
            </div>
            <div className="admin-editor-html-code">
              <textarea
                value={htmlValue}
                onChange={handleHtmlChange}
                onScroll={handleHtmlScroll}
                className="admin-editor-html"
                placeholder="Paste or write HTML content here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
