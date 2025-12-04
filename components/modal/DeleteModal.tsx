'use client'

import { Button, PopupModal } from '@/components/ui'
import React, { useState } from 'react'
import { TrashIcon } from '../icons';

const DeleteModal: React.FC<{ title: string; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; onDelete: () => void }> = ({ open, setOpen, title, onDelete }) => {

    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true);
        await onDelete();
        setLoading(false);
        setOpen(false);
    };

    return (
        <PopupModal
            size='xl'
            radius='2xl'
            isOpen={open}
            onClose={() => setOpen(false)}
            placement='center'
            backdrops='opaque'
            showCloseButton={false}
            className='max-h-[95vh]'
            title={`Delete ${title}`}>


            <div className="p-4">

                <TrashIcon className='size-10 text-red-500 mb-4' />

                <h2 className="text-black text-lg pb-1.5">Are you sure you want to delete this {title} ?</h2>
                <p className="text-gray-800 text-xs md:text-sm">
                    Deleting this {title} is permanent and cannot be undone
                </p>

                <div className="space-y-4 mt-8">

                    <Button loading={loading} onPress={handleDelete} className='bg-red-500 text-white h-12 w-full'>Delete {title} </Button>

                    <Button onPress={() => setOpen(false)} variant='bordered' className='border border-primary text-primary h-12 w-full'>Cancel</Button>

                </div>

            </div>

        </PopupModal>
    )
}

export default DeleteModal