import { createFileLabel, createInputLabel, FileUpload, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'

interface AddBrandModalProps {
    isOpen: boolean
    onClose: () => void
}

const AddBrandModal = ({ isOpen, onClose }: AddBrandModalProps) => {
    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="Add Brand"
            description="Add a new product brand"
            footer={
                <Button size='sm' type='submit' className='h-10 px-8' color="primary" 
                onPress={onClose}>Save Brand</Button>
            }>

            <div className="flex flex-col gap-y-2 p-3">

                <Input
                    name="brandName"
                    label={createInputLabel({
                        name: "Brand Name",
                        required: true
                    })}
                />


                <FileUpload
                    formGroupClass='col-span-2 w-full'
                    className='h-32'
                    name="brandImage"
                    label={createFileLabel({
                        name: "Brand Image",
                        required: true
                    })}
                    maxFileSize={10}
                    acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp']}
                />

            </div>

        </PopupModal>
    )
}

export default AddBrandModal

