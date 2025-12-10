import { createFileLabel, createInputLabel, FileUpload, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="Add Category"
            description="Add a new product category"
            footer={
                <Button size='sm' type='submit' className='h-10 px-6' color="primary" 
                onPress={onClose}>Save Category</Button>
            }>

            <div className="flex flex-col gap-y-2 p-3">

                <Input
                    name="categoryName"
                    label={createInputLabel({
                        name: "Category Name",
                        required: true
                    })}
                />


                <FileUpload
                    formGroupClass='col-span-2 w-full'
                    className='h-32'
                    name="categoryImage"
                    label={createFileLabel({
                        name: "Category Image",
                        required: true
                    })}
                    maxFileSize={10}
                    acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp']}
                />

            </div>

        </PopupModal>
    )
}

export default AddCategoryModal

