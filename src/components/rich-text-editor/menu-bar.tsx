import { useCurrentEditor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Strikethrough
} from 'lucide-react'
import React from 'react'

import { Toggle } from '~/components/ui/toggle'
import useUploadImage from '~/hooks/use-upload-image'

export default function MenuBar({ defaultContent }: { defaultContent?: string }) {
  const { uploadImageMutation } = useUploadImage()

  const inputFileRef = React.useRef<HTMLInputElement>(null)

  const { editor } = useCurrentEditor()

  React.useEffect(() => {
    if (!defaultContent?.trim()) return
    editor?.commands.setContent(defaultContent)
  }, [defaultContent, editor])

  if (!editor) {
    return null
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const form = new FormData()
    form.append('image', e.target.files[0])
    const res = await uploadImageMutation.mutateAsync(form)
    const { url } = res.data.data.medias[0]
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const Options = [
    {
      icon: <Heading1 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive('heading', { level: 1 })
    },
    {
      icon: <Heading2 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive('heading', { level: 2 })
    },
    {
      icon: <Heading3 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive('heading', { level: 3 })
    },
    {
      icon: <Bold className='size-4' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold')
    },
    {
      icon: <Italic className='size-4' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic')
    },
    {
      icon: <Strikethrough className='size-4' />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive('strike')
    },
    {
      icon: <AlignLeft className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: <AlignCenter className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: <AlignRight className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' })
    },
    {
      icon: <List className='size-4' />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive('bulletList')
    },
    {
      icon: <ListOrdered className='size-4' />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive('orderedList')
    },
    {
      icon: <Highlighter className='size-4' />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive('highlight')
    },
    {
      icon: <Image className='size-4' />,
      onClick: () => inputFileRef.current?.click(),
      preesed: editor.isActive('highlight')
    }
  ]

  return (
    <div className='border rounded-md p-1 mb-1 bg-muted space-x-2 z-50'>
      <input hidden ref={inputFileRef} type='file' onChange={(e) => handleUploadImage(e)} />
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          className='data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}
