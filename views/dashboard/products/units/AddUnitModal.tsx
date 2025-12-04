import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'

interface AddUnitModalProps {
    isOpen: boolean
    onClose: () => void
}

const AddUnitModal = ({ isOpen, onClose }: AddUnitModalProps) => {
    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="Add Unit"
            description="Add a new product unit"
            footer={
                <Button size='sm' type='submit' className='h-10 px-8' color="primary" 
                onPress={onClose}>Save Unit</Button>
            }>

            <div className="flex flex-col gap-y-4 p-3">

                {/* ================================ */}
                {/* Basic Information */}
                {/* ================================ */}
                <h2 className='text-sm font-medium text-black/80'>Basic Information</h2>

                <Input
                    name="unitName"
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="Kilogram"
                />
                <p className="text-xs text-gray-500 -mt-3.5">
                    Full name of the unit (e.g., "Kilogram", "Meter")
                </p>

                <Input
                    name="shortName"
                    label={createInputLabel({
                        name: "Short Name",
                        required: true
                    })}
                    placeholder="kg"
                />
                <p className="text-xs text-gray-500 -mt-3.5">
                    Abbreviated form (e.g., "kg", "m")
                </p>

            </div>

        </PopupModal>
    )
}

export default AddUnitModal

