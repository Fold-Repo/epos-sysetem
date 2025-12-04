'use client'

import { createInputLabel, Input, PopupModal, Select } from '@/components'
import { Button } from '@heroui/react'
import { useState, useEffect } from 'react'
import { TrashIcon } from '@/components/icons'
import { VariationTypeItem } from '@/types/variation.type'

interface VariationTypeForm {
    name: string;
    color?: string;
}

interface AddVariationModalProps {
    isOpen: boolean
    onClose: () => void
}

const AddVariationModal = ({ isOpen, onClose }: AddVariationModalProps) => {
    const [selectedType, setSelectedType] = useState<'Color' | 'Size' | 'Other' | ''>('')
    const [variationTypes, setVariationTypes] = useState<VariationTypeForm[]>([{ name: '' }])

    useEffect(() => {
        if (!isOpen) {
            setSelectedType('')
            setVariationTypes([{ name: '' }])
        }
    }, [isOpen])

    const handleTypeChange = (value: string) => {
        setSelectedType(value as 'Color' | 'Size' | 'Other')
        setVariationTypes([{ name: '' }])
    }

    const handleAddVariationType = () => {
        const newType = selectedType === 'Color'
            ? { name: '', color: '#000000' }
            : { name: '' }
        setVariationTypes([...variationTypes, newType])
    }

    const handleRemoveVariationType = (index: number) => {
        setVariationTypes(variationTypes.filter((_, i) => i !== index))
    }

    const handleNameChange = (index: number, value: string) => {
        const updated = [...variationTypes]
        updated[index] = { ...updated[index], name: value }
        setVariationTypes(updated)
    }

    const handleColorChange = (index: number, value: string) => {
        const updated = [...variationTypes]
        updated[index] = { ...updated[index], color: value }
        setVariationTypes(updated)
    }

    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="Add Variation"
            description="Add a new product variation"
            footer={
                <Button size='sm' type='submit' className='h-10 px-8' color="primary"
                    onPress={onClose}>Save Variation</Button>
            }>

            <div className="flex flex-col gap-y-4 p-3">

                {/* ================================ */}
                {/* Basic Information */}
                {/* ================================ */}
                <h2 className='text-sm font-medium text-black/80'>Basic Information</h2>

                <Select
                    name="variationType"
                    label={createInputLabel({
                        name: "Type",
                        required: true
                    })}
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}>
                    <option value="" disabled>Select Type</option>
                    <option value="Color">Color</option>
                    <option value="Size">Size</option>
                    <option value="Other">Other</option>
                </Select>

                {/* ================================ */}
                {/* Variation Types */}
                {/* ================================ */}
                <div className="space-y-3">

                    <div className="flex items-center justify-between">
                        <h2 className='text-sm font-medium text-black/80'>Variation Types:</h2>
                        <Button size="sm" variant="flat" className="text-xs" onPress={handleAddVariationType}>
                            Add Variation
                        </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                        {variationTypes.map((type, index) => (
                            <div key={index} className="w-full flex items-center gap-2">


                                <Input
                                    formGroupClass='w-full flex-1'
                                    name={`variationType-${index}`}
                                    inputSize='sm'
                                    value={type.name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    placeholder={selectedType === 'Color' ? "Enter color name" : "Enter variation"} />

                                {selectedType === 'Color' && (
                                    <input type="color" value={type.color || '#000000'} onChange={(e) => handleColorChange(index, e.target.value)} className="mb-2 w-8 h-8 rounded border border-gray-200 cursor-pointer" title="Select color" />
                                )}

                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-red-500 hover:text-red-700 mb-2"
                                    onPress={() => handleRemoveVariationType(index)}>
                                    <TrashIcon className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </PopupModal>
    )
}

export default AddVariationModal

