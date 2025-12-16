'use client'

import { createInputLabel, Input, PhoneInput, ProfilePictureUpload, createFileLabel, Select } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@/hooks'
import { settingsSchema, SettingsFormData } from '@/schema'
import { DashboardCard } from '@/components'
import { LOGO } from '@/constants'
import { useState, useEffect } from 'react'
import { useGetAddressSuggestions, useGetAddressDetails } from '@/services'

const GeneralSettingsView = () => {
    const { showSuccess, showError } = useToast()

    const [postcodeToLookup, setPostcodeToLookup] = useState<string>('')
    const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [showAddressDropdown, setShowAddressDropdown] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

    const form = useForm<SettingsFormData>({
        resolver: yupResolver(settingsSchema) as any,
        mode: 'onChange',
        defaultValues: {
            companyName: '',
            email: '',
            phone: '',
            logo: undefined,
            postcode: '',
            selectedAddress: '',
            line1: '',
            line2: '',
            town: '',
            city: '',
            country: '',
            state: ''
        }
    })

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = form

    const postcodeValue = watch('postcode') || ''

    // ===========================================
    // Address Suggestions
    // ===========================================
    const {
        data: addressSuggestions = [],
        isLoading: isLookingUp,
        error: suggestionsError,
    } = useGetAddressSuggestions(postcodeToLookup, shouldFetchSuggestions)

    // ===========================================
    // Address Details
    // ===========================================
    const {
        data: addressDetails,
        error: detailsError
    } = useGetAddressDetails(selectedAddressId, !!selectedAddressId)

    // ===========================================
    // Handle Lookup Address
    // ===========================================
    const handleLookupAddress = () => {
        const postcode = postcodeValue.trim()

        if (!postcode) {
            showError('Please enter a postcode')
            return
        }

        // ===========================================
        // Reset State
        // ===========================================
        setPostcodeToLookup(postcode)
        setShouldFetchSuggestions(true)
        setSelectedAddressId('')
        setShowAddressDropdown(false)
        setShowAddressFields(false)
        setValue('selectedAddress', '')
        setValue('line1', '')
        setValue('line2', '')
        setValue('town', '')
        setValue('city', '')
    }

    /**
     * Handle address selection - triggers React Query to fetch full details
     */
    const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addressId = e.target.value
        if (!addressId) {
            setSelectedAddressId('')
            setShowAddressFields(false)
            return
        }

        setSelectedAddressId(addressId)
    }

    // ===========================================
    // Handle Suggestions Response
    // ===========================================
    useEffect(() => {
        if (addressSuggestions.length > 0) {
            setShowAddressDropdown(true)
        } else if (postcodeToLookup && !isLookingUp && shouldFetchSuggestions) {
            setShowAddressDropdown(false)
        }

        if (!isLookingUp && shouldFetchSuggestions) {
            // ===========================================
            // Keep the flag true if we have results, reset if error or no results
            // ===========================================
            if (suggestionsError || addressSuggestions.length === 0) {
                setShouldFetchSuggestions(false)
            }
        }
    }, [addressSuggestions, isLookingUp, postcodeToLookup, shouldFetchSuggestions, suggestionsError])

    // ===========================================
    // Handle Suggestions Error
    // ===========================================
    useEffect(() => {
        if (suggestionsError) {
            showError(suggestionsError instanceof Error ? suggestionsError.message : 'Failed to lookup address. Please try again.')
            setShowAddressDropdown(false)
        }
    }, [suggestionsError, showError])

    // Handle address details response
    useEffect(() => {
        if (addressDetails) {
            setShowAddressFields(true)
            // ===========================================
            // Auto-populate Form Fields with Address Details
            // ===========================================
            setValue('line1', addressDetails.line_1 || '')
            setValue('line2', addressDetails.line_2 || '')
            setValue('town', addressDetails.town_or_city || addressDetails.locality || '')
            setValue('city', addressDetails.town_or_city || addressDetails.locality || '')
        }
    }, [addressDetails, setValue])

    // ===========================================
    // Handle Address Details Error
    // ===========================================
    useEffect(() => {
        if (detailsError) {
            showError(detailsError instanceof Error ? detailsError.message : 'Failed to fetch address details. Please try again.')
            setShowAddressFields(false)
        }
    }, [detailsError, showError])

    const handleFormSubmit = async (data: SettingsFormData) => {
        try {
            console.log('Settings update:', data)
            showSuccess(
                'Settings updated',
                'Your company settings have been updated successfully.'
            )
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <div className="space-y-6">

            <DashboardCard bodyClassName='p-5' title="Company Details">
                
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-6">

                    {/* =========================================== */}
                    {/* Company Logo */}
                    {/* =========================================== */}
                    <div className="mb-1">
                        <Controller
                            name="logo"
                            control={control}
                            render={({ field }) => (
                                <ProfilePictureUpload
                                    label={createFileLabel({
                                        name: "Company Logo",
                                        required: false
                                    })}
                                    labelClassName='font-medium mb-3'
                                    name="logo"
                                    value={field.value as FileList | null}
                                    onChange={(e) => {
                                        field.onChange(e.target.files)
                                    }}
                                    error={errors.logo?.message as string}
                                    defaultImage={LOGO.logo_1}
                                />
                            )}
                        />
                    </div>

                    {/* =========================================== */}
                    {/* Company Information */}
                    {/* =========================================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* =========================================== */}
                        {/* Company Name */}
                        {/* =========================================== */}
                        <div className="space-y-4">

                            <Input
                                label={createInputLabel({
                                    name: "Company Name",
                                    required: true
                                })}
                                placeholder="Enter company name"
                                {...register('companyName')}
                                error={errors.companyName?.message as string}
                            />

                            <Input
                                label={createInputLabel({
                                    name: "Email",
                                    required: true
                                })}
                                type="email"
                                placeholder="Enter email address"
                                {...register('email')}
                                error={errors.email?.message as string}
                            />

                        </div>

                        <div className="space-y-4">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        label={createInputLabel({
                                            name: "Phone",
                                            required: true
                                        })}
                                        placeholder="Enter phone number"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        error={errors.phone?.message as string}
                                    />
                                )}
                            />
                        </div>

                    </div>

                    {/* =========================================== */}
                    {/* Postcode Section with Lookup Button */}
                    {/* =========================================== */}
                    <div className="flex items-center gap-x-2">
                        <Input
                            formGroupClass='flex-1'
                            label={createInputLabel({ name: "Postcode", required: true })}
                            placeholder="Enter postcode"
                            {...register('postcode')}
                            error={errors.postcode?.message}
                        />
                        <Button
                            type="button"
                            radius="md"
                            className="text-white text-xs mt-3.5"
                            color='primary'
                            onPress={handleLookupAddress}
                            isLoading={isLookingUp}
                            isDisabled={!postcodeValue.trim() || isLookingUp}>
                            Lookup Address
                        </Button>
                    </div>

                    {/* =========================================== */}
                    {/* Address Selection Dropdown */}
                    {/* =========================================== */}
                    {showAddressDropdown && addressSuggestions.length > 0 && (
                        <Controller
                            name="selectedAddress"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    formGroupClass='col-span-2'
                                    label={createInputLabel({ name: "Address", required: true })}
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleAddressSelect(e)
                                    }}
                                    error={errors.selectedAddress?.message}>
                                    <option value="" disabled>Select Address</option>
                                    {addressSuggestions.map((suggestion, index) => (
                                        <option key={index} value={suggestion.id}>
                                            {suggestion.address}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                    )}

                    {/* =========================================== */}
                    {/* Address Fields */}
                    {/* =========================================== */}
                    {showAddressFields && addressDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Input
                                label='Line 1'
                                placeholder="Enter line 1"
                                {...register('line1')}
                                error={errors.line1?.message}
                                disabled
                            />

                            <Input
                                label='Line 2'
                                placeholder="Enter line 2"
                                {...register('line2')}
                                error={errors.line2?.message}
                                disabled
                            />

                            <Input
                                label='Town'
                                placeholder="Enter town"
                                {...register('town')}
                                error={errors.town?.message}
                                disabled
                            />

                            <Input
                                label='City'
                                placeholder="Enter city"
                                {...register('city')}
                                error={errors.city?.message}
                                disabled
                            />

                        </div>
                    )}

                    {/* =========================================== */}
                    {/* Country and State */}
                    {/* =========================================== */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input
                            label={createInputLabel({
                                name: "Country",
                                required: false
                            })}
                            placeholder="Enter country"
                            {...register('country')}
                            error={errors.country?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "State",
                                required: false
                            })}
                            placeholder="Enter state"
                            {...register('state')}
                            error={errors.state?.message as string}
                        />

                    </div> */}

                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="submit" radius='md' className='px-6 bg-primary text-white text-xs h-10'
                            isLoading={isSubmitting}>
                            Update Company Details
                        </Button>
                    </div>

                </form>
            </DashboardCard>
        </div>
    )
}

export default GeneralSettingsView
