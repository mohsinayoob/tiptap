import { Command, Node, nodeInputRule } from '@tiptap/core'

export interface ImageOptions {
  inline: boolean,
  HTMLAttributes: {
    [key: string]: any
  },
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

const Image = Node.create({
  name: 'image',

  defaultOptions: <ImageOptions>{
    inline: false,
    HTMLAttributes: {},
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes]
  },

  addCommands() {
    return {
      /**
       * Add an image
       */
      image: (options: { src: string, alt?: string, title?: string }): Command => ({ tr }) => {
        const { selection } = tr
        const node = this.type.create(options)

        tr.replaceRangeWith(selection.from, selection.to, node)

        return true
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule(inputRegex, this.type, match => {
        const [, alt, src, title] = match

        return { src, alt, title }
      }),
    ]
  },
})

export default Image

declare global {
  namespace Tiptap {
    interface AllExtensions {
      Image: typeof Image,
    }
  }
}