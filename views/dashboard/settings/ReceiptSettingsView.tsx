'use client'

import { createInputLabel, TextArea } from '@/components'
import { Button, Switch } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@/hooks'
import { receiptSettingsSchema, ReceiptSettingsFormData } from '@/schema'
import { DashboardCard } from '@/components'

const ReceiptSettingsView = () => {
    const { showSuccess } = useToast()

    const form = useForm<ReceiptSettingsFormData>({
        resolver: yupResolver(receiptSettingsSchema) as any,
        mode: 'onChange',
        defaultValues: {
            showNote: true,
            showAddress: true,
            showBarcodeInReceipt: true,
            showTax: true,
            showPhone: false,
            showEmail: false,
            showLogoInPaymentSlip: true,
            showCustomer: false,
            showDiscountAndShipping: false,
            showProductCode: false,
            note: 'Thanks For The Shopping.'
        }
    })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = form

    // Switch configurations
    const switchOptions = [
        { name: 'showNote' as const, label: 'Show note' },
        { name: 'showAddress' as const, label: 'Show Address' },
        { name: 'showBarcodeInReceipt' as const, label: 'Show barcode in receipt' },
        { name: 'showTax' as const, label: 'Show Tax' },
        { name: 'showPhone' as const, label: 'Show Phone' },
        { name: 'showEmail' as const, label: 'Show Email' },
        { name: 'showLogoInPaymentSlip' as const, label: 'Show logo in payment slip' },
        { name: 'showCustomer' as const, label: 'Show Customer' },
        { name: 'showDiscountAndShipping' as const, label: 'Show Discount & Shipping' },
        { name: 'showProductCode' as const, label: 'Show Product Code' },
    ]

    const handleFormSubmit = async (data: ReceiptSettingsFormData) => {
        try {
            console.log('Receipt settings update:', data)
            showSuccess(
                'Receipt settings updated',
                'Your receipt settings have been updated successfully.'
            )
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <DashboardCard bodyClassName='p-5' title="Receipt Settings">
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-6">
                
                {/* =========================================== */}
                {/* Toggle Switches */}
                {/* =========================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {switchOptions.map((option) => (
                        <Controller
                            key={option.name}
                            name={option.name}
                            control={control}
                            render={({ field }) => (
                                <Switch isSelected={field.value}
                                    onValueChange={field.onChange}
                                    size="sm">
                                    <span className="text-xs">{option.label}</span>
                                </Switch>
                            )}
                        />
                    ))}
                </div>

                {/* =========================================== */}
                {/* Note Section */}
                {/* =========================================== */}
                <div>
                    <TextArea
                        label={createInputLabel({
                            name: "Note",
                            required: true
                        })}
                        placeholder="Enter receipt note"
                        {...register('note')}
                        error={errors.note?.message as string}
                        rows={4}
                    />
                </div>

                {/* =========================================== */}
                {/* Save Button */}
                {/* =========================================== */}
                <div className="flex justify-start gap-3 mt-4">
                    <Button
                        type="submit"
                        radius='md'
                        className='px-6 bg-primary text-white text-xs h-10'
                        isLoading={isSubmitting}>
                        Save
                    </Button>
                </div>

            </form>
        </DashboardCard>
    )
}

export default ReceiptSettingsView
