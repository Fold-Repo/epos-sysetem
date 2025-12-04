'use client'

import React, { useRef } from "react"
import { PopupModal } from "@/components"
import { Button } from "@heroui/react"
import BarcodeLabels from "./BarcodeLabels"

interface BarcodeProduct {
    id: string
    name: string
    code: string
    quantity: number
    price?: number
}

interface BarCodeModalProps {
    isOpen: boolean
    onClose: () => void
    barcodeProducts: BarcodeProduct[]
    paperSize: string
    storeName: string
    showOptions: {
        storeName: boolean
        productName: boolean
        price: boolean
        border: boolean
    }
    onPrint: () => void
    printRef?: React.RefObject<HTMLDivElement | null>
}

const BarCodeModal: React.FC<BarCodeModalProps> = ({
    isOpen,
    onClose,
    barcodeProducts,
    paperSize,
    storeName,
    showOptions,
    onPrint,
    printRef: externalPrintRef
}) => {

    const internalPrintRef = useRef<HTMLDivElement>(null)
    const printRef = externalPrintRef || internalPrintRef


    return (
        <PopupModal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            placement="center"
            title="Barcode Preview"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="bordered" onPress={onClose}
                        className="text-xs h-9 px-8">
                        Close
                    </Button>
                    <Button color="secondary" onPress={onPrint} className="text-xs h-9 px-8">
                        Print
                    </Button>
                </div>
            }>

            <div ref={printRef} className="label-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}>
                <BarcodeLabels
                    barcodeProducts={barcodeProducts}
                    storeName={storeName}
                    showOptions={showOptions}
                />
            </div>

        </PopupModal>
    )
}

export default BarCodeModal

