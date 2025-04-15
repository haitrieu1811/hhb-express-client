import { Eye, EyeOff } from 'lucide-react'
import React, { InputHTMLAttributes } from 'react'

import { Input } from '~/components/ui/input'

type InputPasswordProps = InputHTMLAttributes<HTMLInputElement>

export default function InputPassword(props: InputPasswordProps) {
  const [type, setType] = React.useState<'text' | 'password'>('password')

  const handleType = () => {
    if (type === 'password') setType('text')
    else setType('password')
  }

  return (
    <div className='relative'>
      <Input type={type} {...props} />
      <div
        className='absolute top-1/2 -translate-y-1/2 right-0 w-10 flex justify-center items-center hover:cursor-pointer'
        onClick={handleType}
      >
        {type === 'text' && <Eye className='w-5 h-5' />}
        {type === 'password' && <EyeOff className='w-5 h-5' />}
      </div>
    </div>
  )
}
