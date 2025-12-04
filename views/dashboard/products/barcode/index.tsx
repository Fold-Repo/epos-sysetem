'use client'

import { CustomAutocomplete, Input, Select, TableComponent, TableCell, Label } from "@/components"
import React, { useState, useRef } from "react"
import { TrashIcon } from "@/components/icons"
import { Button, Switch, useDisclosure } from "@heroui/react"
import { productsData } from "../product_view/data"
import BarCodeModal from "./BarCodeModal"
import BarcodeLabels from "./BarcodeLabels"

interface BarcodeProduct {
    id: string
    name: string
    code: string
    quantity: number
    price?: number
}

interface ProductBarcodeViewProps {
    storeName?: string
}

const paperSizeOptions = [
    { value: "A4", label: "A4" },
    { value: "A5", label: "A5" },
    { value: "A6", label: "A6" },
    { value: "Letter", label: "Letter" },
    { value: "Legal", label: "Legal" },
]

const ProductBarcodeView = ({ storeName: storeNameProp = "Nodje" }: ProductBarcodeViewProps) => {
    
    const [barcodeProducts, setBarcodeProducts] = useState<BarcodeProduct[]>([])
    const [selectedProductId, setSelectedProductId] = useState<string>("")
    const [paperSize, setPaperSize] = useState<string>("A4")
    const [warehouse, setWarehouse] = useState<string>("")
    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()
    const printRef = useRef<HTMLDivElement>(null)

    const [showOptions, setShowOptions] = useState({
        storeName: true,
        productName: false,
        price: false,
        border: true,
    })

    const columns = [
        { key: 'product', title: 'PRODUCT' },
        { key: 'qty', title: 'QTY' },
        { key: 'action', title: 'ACTION' },
    ]

    const handleProductSelect = (productId: string) => {
        if (!productId) return

        const product = productsData.find(p => p.id === productId)
        if (!product) return

        const existingProduct = barcodeProducts.find(p => p.id === productId)
        if (existingProduct) {
            setBarcodeProducts(prev =>
                prev.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            setBarcodeProducts(prev => [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    code: product.code,
                    quantity: 20,
                    price: product.price
                }
            ])
        }

        setSelectedProductId("")
    }

    const handleQuantityChange = (id: string, quantity: number) => {
        setBarcodeProducts(prev =>
            prev.map(item => item.id === id ? { ...item, quantity } : item)
        )
    }

    const handleDelete = (id: string) => {
        setBarcodeProducts(prev => prev.filter(item => item.id !== id))
    }

    const handleReset = () => {
        setBarcodeProducts([])
        setSelectedProductId("")
        setPaperSize("A4")
        setWarehouse("")
        setShowOptions({
            storeName: true,
            productName: false,
            price: false,
            border: false,
        })
    }

    const handlePrint = () => {
        if (printRef.current) {
            const checkAndPrint = () => {
                const svgs = printRef.current?.querySelectorAll('svg')
                const expectedSvgCount = barcodeProducts.reduce((sum, p) => sum + p.quantity, 0)
                
                if (svgs && (svgs.length >= expectedSvgCount || svgs.length > 0)) {
                    const printContentHTML = printRef.current!.innerHTML
                    const printWindow = window.open('', '_blank')
                    if (printWindow) {
                        printDirectly(printWindow, printContentHTML)
                    }
                } else {
                    const attempts = (checkAndPrint as any).attempts || 0
                    if (attempts < 10) {
                        (checkAndPrint as any).attempts = attempts + 1
                        setTimeout(checkAndPrint, 200)
                    }
                }
            }
            
            setTimeout(checkAndPrint, 300)
        }
    }

    const printDirectly = (printWindow: Window, printContentHTML: string) => {
        if (printWindow) {
                const columns = 5 
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Print Barcodes</title>
                        <style>
                            @page {
                                size: ${paperSize};
                                margin: 10mm;
                            }
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }
                            body {
                                font-family: Arial, sans-serif;
                                padding: 10mm;
                            }
                            .label-container {
                                display: flex !important;
                                flex-direction: column !important;
                                width: 100% !important;
                                gap: 0 !important;
                            }
                            .label-container > div {
                                display: grid !important;
                                grid-template-columns: repeat(${columns}, 1fr) !important;
                                gap: 3px !important;
                                width: 100% !important;
                                padding-bottom: 20px !important;
                            }
                            .label-container > div:not(:first-child) {
                                border-top: 1px solid #9ca3af !important;
                                padding-top: 32px !important;
                                margin-top: 32px !important;
                            }
                            .label-container > div > div {
                                padding: 8px !important;
                                text-align: center !important;
                                display: flex !important;
                                flex-direction: column !important;
                                align-items: center !important;
                                justify-content: center !important;
                                min-width: 150px !important;
                                min-height: 120px !important;
                                page-break-inside: avoid !important;
                                flex-shrink: 0 !important;
                                box-sizing: border-box !important;
                                overflow: hidden !important;
                                width: 100% !important;
                                max-width: 100% !important;
                                ${showOptions.border ? 'border: 1px solid #ccc !important;' : ''}
                            }
                            .label-container > div > div > * {
                                text-align: center !important;
                                font-size: 0.75rem !important;
                                line-height: 1rem !important;
                                max-width: 100% !important;
                                overflow: hidden !important;
                            }
                            .label-container > div > div > div {
                                text-align: center !important;
                                font-size: 0.75rem !important;
                                line-height: 1rem !important;
                                max-width: 100% !important;
                                overflow: hidden !important;
                            }
                            .label-container .text-xs {
                                font-size: 0.75rem !important;
                                line-height: 1rem !important;
                                text-align: center !important;
                            }
                            .label-container .font-semibold {
                                font-weight: 600 !important;
                            }
                            .label-container .uppercase {
                                text-transform: uppercase !important;
                            }
                            .label-container .mb-0 {
                                margin-bottom: 0 !important;
                            }
                            .label-container .mb-0\\.5 {
                                margin-bottom: 0.125rem !important;
                            }
                            .label-container .mt-0\\.5 {
                                margin-top: 0.125rem !important;
                            }
                            .label-container .line-clamp-1 {
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                                white-space: nowrap !important;
                                text-align: center !important;
                                width: 100% !important;
                                max-width: 100% !important;
                            }
                            .label-container > div > div > div.line-clamp-1 {
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                                white-space: nowrap !important;
                                text-align: center !important;
                                width: 100% !important;
                                max-width: 100% !important;
                                display: block !important;
                            }
                            .label-container .flex {
                                display: flex !important;
                            }
                            .label-container .justify-center {
                                justify-content: center !important;
                            }
                            .label-container .items-center {
                                align-items: center !important;
                            }
                            .label-container svg {
                                max-width: 100% !important;
                                width: 100% !important;
                                height: auto !important;
                                display: block !important;
                                overflow: hidden !important;
                            }
                            .label-container > div > div > div.flex {
                                max-width: 100% !important;
                                overflow: hidden !important;
                                width: 100% !important;
                            }
                        </style>
                    </head>
                    <body>
                    </body>
                    </html>
                `)
                const contentDiv = printWindow.document.createElement('div')
                contentDiv.className = 'label-container'
                contentDiv.innerHTML = printContentHTML
                printWindow.document.body.appendChild(contentDiv)
                printWindow.document.close()
            setTimeout(() => {
                printWindow.print()
            }, 500)
        }
    }

    const renderRow = (item: BarcodeProduct) => {
        return (
            <>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-900 font-medium">
                            {item.name}
                        </span>
                        <span className="text-[11px] text-gray-600 underline mt-0.5">
                            {item.code}
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <Input name={`qty-${item.id}`} type="number" min={20} value={String(item.quantity)} 
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)} className="w-20 h-9"  inputSize="sm" />
                </TableCell>
                <TableCell>
                    <Button isIconOnly size="sm"
                        variant="light" className="text-red-500 hover:text-red-600"
                        onPress={() => handleDelete(item.id)}>
                        <TrashIcon className="size-4" />
                    </Button>
                </TableCell>
            </>
        )
    }

    return (
        <div className="space-y-4">

            {/* ================================ FORM ================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">

                <Select 
                    name="warehouse" 
                    label="Warehouse"
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}>
                    <option value="" disabled>Select Warehouse</option>
                    <option value="1">Warehouse 1</option>
                    <option value="2">Warehouse 2</option>
                    <option value="3">Warehouse 3</option>
                </Select>

                <CustomAutocomplete
                    name="product"
                    label="Product"
                    placeholder="Select Product"
                    radius="lg"
                    inputSize="sm"
                    options={productsData.map(p => ({ value: p.id, label: p.name }))}
                    value={selectedProductId}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            handleProductSelect(value)
                        }
                    }}
                />

                <Select
                    name="paper_size"
                    label="Choose Paper size"
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}>
                    <option value="" disabled>Select Paper Size</option>
                    {paperSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>

                <div className="flex flex-wrap justify-between items-center gap-3 pt-4 shrink-0">

                    <div className="space-y-1 shrink-0">
                        <Label label="Show Store Name" htmlFor="storeName" />
                        <Switch 
                            size="sm"
                            isSelected={showOptions.storeName}
                            onValueChange={(value) => setShowOptions(prev => ({ ...prev, storeName: value }))}
                        />
                    </div>

                    <div className="space-y-1 shrink-0">
                        <Label label="Show Product Name" htmlFor="productName" />
                        <Switch 
                            size="sm"
                            isSelected={showOptions.productName}
                            onValueChange={(value) => setShowOptions(prev => ({ ...prev, productName: value }))}
                        />
                    </div>

                    <div className="space-y-1 shrink-0">
                        <Label label="Show Price" htmlFor="price" />
                        <Switch size="sm" isSelected={showOptions.price}
                        onValueChange={(value) => setShowOptions(prev => ({ ...prev, price: value }))}
                        />
                    </div>

                    <div className="space-y-1 shrink-0">
                        <Label label="Show Border" htmlFor="border" />
                        <Switch size="sm" isSelected={showOptions.border}
                        onValueChange={(value) => setShowOptions(prev => ({ ...prev, border: value }))}
                        />
                    </div>

                </div>

            </div>

            {/* ================================ TABLE ================================ */}
            <TableComponent
                className="mt-5"
                columns={columns}
                data={barcodeProducts}
                rowKey={(item) => item.id}
                renderRow={renderRow}
            />

            {/* ================================ BUTTONS ================================ */}
            <div className="flex justify-end gap-4 mt-5">

                <Button className="text-xs h-9 px-8" radius="sm" color="success"
                    onPress={onPreviewOpen}
                    isDisabled={barcodeProducts.length === 0 || !paperSize}>
                    Preview
                </Button>

                <Button className="text-xs h-9 px-8" radius="sm" 
                    color="danger" onPress={handleReset}>
                    Reset
                </Button>

                <Button className="text-xs h-9 px-8" radius="sm" color="secondary" onPress={handlePrint}
                    isDisabled={barcodeProducts.length === 0 || !paperSize}>
                    Print
                </Button>

            </div>

            {/* ================================ PREVIEW MODAL ================================ */}
            <BarCodeModal isOpen={isPreviewOpen} onClose={onPreviewClose}
                barcodeProducts={barcodeProducts} paperSize={paperSize}
                storeName={storeNameProp} showOptions={showOptions} onPrint={handlePrint}
            />

            {/* ================================ HIDDEN PRINT CONTAINER (Always Rendered) ================================ */}
            <div 
                ref={printRef}
                className="label-container"
                style={{
                    position: 'fixed',
                    left: '-9999px',
                    top: '0',
                    width: '210mm',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'none',
                    zIndex: -1
                }}>
                {barcodeProducts.length > 0 && (
                    <BarcodeLabels
                        barcodeProducts={barcodeProducts}
                        storeName={storeNameProp}
                        showOptions={showOptions}
                    />
                )}
            </div>

        </div>
    )
}

export default ProductBarcodeView

