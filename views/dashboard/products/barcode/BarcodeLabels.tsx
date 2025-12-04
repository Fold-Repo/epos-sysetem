'use client'

import React from "react"
import Barcode from 'react-barcode'
import { formatCurrency } from "@/lib"

interface BarcodeProduct {
    id: string
    name: string
    code: string
    quantity: number
    price?: number
}

interface BarcodeLabelsProps {
    barcodeProducts: BarcodeProduct[]
    storeName: string
    showOptions: {
        storeName: boolean
        productName: boolean
        price: boolean
        border: boolean
    }
}

const BarcodeLabels: React.FC<BarcodeLabelsProps> = ({
    barcodeProducts,
    storeName,
    showOptions
}) => {
    const columns = 5
    const productGroups: React.ReactElement[] = []
    
    barcodeProducts.forEach((product, productIndex) => {
        const productLabels: React.ReactElement[] = []
        
        for (let i = 0; i < product.quantity; i++) {
            productLabels.push(
                <div
                    key={`${product.id}-${i}`}
                    className={`p-2 text-center flex flex-col items-center justify-center shrink-0 ${showOptions.border ? 'border border-gray-300' : ''}`}
                    style={{
                        minWidth: '150px',
                        minHeight: '120px',
                        pageBreakInside: 'avoid',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: '100%'
                    }}>
                    {showOptions.storeName && (
                        <div className="text-xs font-semibold mb-0.5 line-clamp-1 uppercase" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>{storeName}</div>
                    )}
                    {showOptions.productName && (
                        <div className="text-xs mb-0 line-clamp-1" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>{product.name}</div>
                    )}
                    {showOptions.price && product.price && (
                        <div className="text-xs mt-0.5">Price: {formatCurrency(product.price)}</div>
                    )}
                    <div className="flex justify-center mb-0">
                        <Barcode
                            value={product.code}
                            format="CODE128"
                            width={1}
                            height={40}
                            displayValue={false}
                        />
                    </div>
                    <div className="text-xs line-clamp-1" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>{product.code}</div>
                </div>
            )
        }
        
        const dividerClass = productIndex === 0 ? '' : 'border-t border-gray-400 pt-8 mt-8'
        productGroups.push(
            <div
                key={`product-${product.id}`}
                className={`w-full ${dividerClass}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '3px',
                    paddingBottom: '20px'
                }}>
                {productLabels}
            </div>
        )
    })
    
    return <>{productGroups}</>
}

export default BarcodeLabels

