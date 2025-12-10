import { createFileLabel, createInputLabel, FileUpload, Input, PopupModal, Select } from '@/components'
import { Button } from '@heroui/react'

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
    

    return (
        <PopupModal
            size="2xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title="Create Product"
            description="Add a new product to the system"
            footer={
                <Button type='submit' className='px-6' color="primary" onPress={onClose}>Save Product</Button>
            }>

            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-3 p-3">

                <FileUpload
                    formGroupClass='col-span-2 w-full'
                    className='h-32'
                    name="catalog"
                    label={createFileLabel({
                        name: "Product Image",
                        required: true
                    })}
                    maxFileSize={10}
                    acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp']}
                />

                {/* ================================ */}
                {/* Basic Information */}
                {/* ================================ */}
                <h2 className='col-span-2 text-sm font-medium text-black/80'>Basic Information</h2>

                <Input 
                    name="productName" 
                    label={createInputLabel({
                        name: "Product Name",
                        required: true
                    })}
                />

                <Input 
                    name="skuBarcode" 
                    label={createInputLabel({
                        name: "SKU/Barcode",
                        required: true
                    })}
                />

                <Input 
                    name="price" 
                    label={createInputLabel({
                        name: "Price",
                        required: true
                    })}
                    isCurrency={true}
                    type="text"
                />

                <Select 
                    name="productCategory" 
                    label={createInputLabel({
                        name: "Product Category",
                        required: true
                    })}>
                    <option value="" disabled selected>Select Category</option>
                    <option value="" disabled>Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="food-beverage">Food & Beverage</option>
                </Select>

                <Select 
                    name="brand" 
                    label={createInputLabel({
                        name: "Brand",
                        required: true
                    })}>
                    <option value="" disabled>Choose Brand</option>
                    <option value="brand1">Brand 1</option>
                    <option value="brand2">Brand 2</option>
                </Select>

                <Select 
                    name="barcodeSymbology" 
                    label={createInputLabel({
                        name: "Barcode Symbology",
                        required: false
                    })}>
                    <option value="" disabled selected>Select Barcode Type</option>
                    <option value="" disabled>Choose barcode type</option>
                    <option value="code128">Code 128</option>
                    <option value="ean13">EAN-13</option>
                    <option value="upc">UPC</option>
                </Select>

                {/* ================================ */}
                {/* Units & Measurements */}
                {/* ================================ */}
                <h2 className='col-span-2 text-sm font-medium text-black/80 my-2'>Units & Measurements</h2>

                <Select 
                    name="productUnit" 
                    label={createInputLabel({
                        name: "Product Unit",
                        required: false
                    })}>
                    <option value="" disabled>Choose Product Unit</option>
                    <option value="piece">Piece</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                    <option value="kg">Kilogram</option>
                    <option value="g">Gram</option>
                    <option value="l">Liter</option>
                    <option value="ml">Milliliter</option>
                </Select>

                <Select 
                    name="saleUnit" 
                    label={createInputLabel({
                        name: "Sale Unit",
                        required: false
                    })}>
                    <option value="" disabled>Choose Sale Unit</option>
                    <option value="piece">Piece</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                </Select>

                <Select 
                    name="purchaseUnit" 
                    label={createInputLabel({
                        name: "Purchase Unit",
                        required: false
                    })}>
                    <option value="" disabled>Choose Purchase Unit</option>
                    <option value="piece">Piece</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                </Select>

                <Select 
                    name="quantityLimitation" 
                    label={createInputLabel({
                        name: "Quantity Limitation",
                        required: false
                    })}>
                    <option value="" disabled>Choose Quantity Limitation</option>
                    <option value="unlimited">Unlimited</option>
                    <option value="limited">Limited</option>
                </Select>

                {/* ================================ */}
                {/* Inventory Details */}
                {/* ================================ */}
                <h2 className='col-span-2 text-sm font-medium text-black/80 my-2'>Inventory Details</h2>

                <Select 
                    name="warehouse" 
                    label={createInputLabel({
                        name: "Warehouse",
                        required: false
                    })}>
                    <option value="" disabled>Choose warehouse</option>
                    <option value="main">Main Warehouse</option>
                    <option value="secondary">Secondary warehouse</option>
                </Select>

                <Select 
                    name="supplier" 
                    label={createInputLabel({
                        name: "Supplier",
                        required: false
                    })}>
                    <option value="" disabled>Choose Supplier</option>
                    <option value="supplier1">Supplier 1</option>
                    <option value="supplier2">Supplier 2</option>
                </Select>

                <Select 
                    name="inventoryQuantityLimitation" 
                    label={createInputLabel({
                        name: "Quantity Limitation",
                        required: false
                    })}>
                    <option value="" disabled>Choose Quantity Limitation</option>
                    <option value="unlimited">Unlimited</option>
                    <option value="limited">Limited</option>
                </Select>

                <Input
                    name="expiryDate"
                    label={createInputLabel({
                        name: "Expiry Date",
                        required: false
                    })}
                    type="date"
                />

                <Select 
                    formGroupClass='col-span-2'
                    name="productType" 
                    label={createInputLabel({
                        name: "Product Type",
                        required: false
                    })}>
                    <option value="" disabled>Choose Product type</option>
                    <option value="standard">Standard</option>
                    <option value="services">Services</option>
                    <option value="digital">Digital</option>
                </Select>

            </div>

        </PopupModal>
    )
}

export default AddProductModal