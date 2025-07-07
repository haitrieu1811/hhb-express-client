import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { TextAlign } from '@tiptap/extension-text-align'
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import MenuBar from '~/components/rich-text-editor/menu-bar'

const extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc ml-3'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal ml-3'
      }
    }
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  Highlight,
  Image.configure({
    HTMLAttributes: {
      class: 'rounded-md object-contain mx-auto'
    }
  })
]

type RichTextEditorProps = {
  content: string
  defaultContent?: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, defaultContent, onChange }: RichTextEditorProps) {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      slotBefore={<MenuBar defaultContent={defaultContent} />}
      editorProps={{
        attributes: {
          class: 'min-h-[400px] border rounded-md py-2 px-3 outline-none'
        }
      }}
      onUpdate={({ editor }) => onChange(editor.getHTML())}
    />
  )
}
