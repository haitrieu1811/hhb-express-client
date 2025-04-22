import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '~/components/ui/button'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <Button variant='ghost' onClick={() => navigate(-1)}>
      <ChevronLeft className='w-4 h-4 mr-1' />
      Quay lại
    </Button>
  )
}
