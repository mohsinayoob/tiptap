import { Command, Node } from '@tiptap/core'
import { exitCode } from 'prosemirror-commands'

const HardBreak = Node.create({
  name: 'hardBreak',

  inline: true,

  group: 'inline',

  selectable: false,

  parseHTML() {
    return [
      { tag: 'br' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['br', HTMLAttributes]
  },

  addCommands() {
    return {
      /**
       * Add a hard break
       */
      hardBreak: (): Command => ({ commands, state, dispatch }) => {
        return commands.try([
          () => exitCode(state, dispatch),
          () => {
            if (dispatch) {
              state.tr.replaceSelectionWith(this.type.create()).scrollIntoView()
            }

            return true
          },
        ])
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.hardBreak(),
      'Shift-Enter': () => this.editor.commands.hardBreak(),
    }
  },
})

export default HardBreak

declare global {
  namespace Tiptap {
    interface AllExtensions {
      HardBreak: typeof HardBreak,
    }
  }
}