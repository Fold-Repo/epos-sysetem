'use client'

import { Button } from '@heroui/react'
import { ExportIcon } from './icons'

const ExportButton = () => {
  return (
        <Button className='text-[12px] border-0 h-auto text-text-color rounded-lg py-2 px-3 bg-white flex items-center gap-2'>
            <ExportIcon className='text-slate-400' />
            Export
        </Button>
  )
}

export default ExportButton