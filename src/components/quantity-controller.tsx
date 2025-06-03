/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Minus, Plus } from 'lucide-react'
import React from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { NUMBER_REGEX } from '~/constants/regex'

type QuantityControllerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: number
  max?: number
  onDecrease?: (value: number) => void
  onIncrease?: (value: number) => void
  onType?: (value: number) => void
}

export default function QuantityController({
  value,
  max,
  onChange,
  onDecrease,
  onIncrease,
  onType
}: QuantityControllerProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (NUMBER_REGEX.test(value)) {
      onChange && onChange(e)

      let newValue = Number(e.target.value)
      if (newValue < 1) {
        newValue = 1
      } else if (max && newValue >= max) {
        newValue = max
      }
      onType && onType(newValue)
    }
  }

  const handleDecrease = () => {
    let newValue = value - 1
    if (newValue < 1) {
      newValue = 1
    }
    onDecrease && onDecrease(newValue)
  }

  const handleIncrease = () => {
    let newValue = value + 1
    if (max && value >= max) {
      newValue = max
    }
    onIncrease && onIncrease(newValue)
  }

  return (
    <div className='flex items-center space-x-1'>
      <Button variant='outline' onClick={handleDecrease}>
        <Minus />
      </Button>
      <Input className='w-16 h-10 text-center' value={value} onChange={handleInputChange} />
      <Button variant='outline' onClick={handleIncrease}>
        <Plus />
      </Button>
    </div>
  )
}
