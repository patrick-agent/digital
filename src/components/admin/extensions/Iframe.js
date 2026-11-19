import { Node, mergeAttributes } from "@tiptap/core"

export const Iframe = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "560" },
      height: { default: "315" },
      title: { default: "" },
      allow: { default: "" },
      allowfullscreen: { default: true },
      frameborder: { default: "0" },
      loading: { default: "lazy" },
      style: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "iframe[src]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "articleEmbed" },
      ["iframe", mergeAttributes(HTMLAttributes)],
    ]
  },
})
