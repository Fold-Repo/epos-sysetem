'use client'

import { createInputLabel, Input, PhoneInput, Select } from '@/components'
import { Button } from '@heroui/react'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepTwoSchema } from '@/schema/auth.schema'
import { useToast } from '@/hooks'
import { useGetAddressSuggestions, useGetAddressDetails } from '@/services'
import { AddressDetails } from '@/types/address'

interface RegStepTwoProps {
    onNextStep?: (data?: any) => void;
    onPrevStep?: () => void;
    formData?: Record<string, any>;
}

const RegStepTwo: React.FC<RegStepTwoProps> = ({ onNextStep, onPrevStep, formData }) => {

    const { showError } = useToast()

    const [postcodeToLookup, setPostcodeToLookup] = useState<string>('')
    const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [showAddressDropdown, setShowAddressDropdown] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepTwoSchema),
        mode: 'onChange',
        defaultValues: {
            ...formData,
        }
    })

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
        setValue('addressline1', '')
        setValue('addressline2', '')
        setValue('addressline3', '')
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
            setValue('addressline1', addressDetails.line_1 || '')
            setValue('addressline2', addressDetails.line_2 || '')
            setValue('addressline3', addressDetails.line_3 || '')
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

    const onSubmit = async (data: any) => {
        try {
            onNextStep?.(data)
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to submit form. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* =========================================== */}
                {/* First Name */}
                {/* =========================================== */}
                <Input
                    label={createInputLabel({ name: "First Name", required: true })}
                    placeholder="Enter first name"
                    {...register('firstname')}
                    error={errors.firstname?.message}
                />

                {/* =========================================== */}
                {/* Last Name */}
                {/* =========================================== */}
                <Input
                    label={createInputLabel({ name: "Last Name", required: true })}
                    placeholder="Enter last name"
                    {...register('lastname')}
                    error={errors.lastname?.message}
                />

                {/* =========================================== */}
                {/* Email Address */}
                {/* =========================================== */}
                <Input
                    label={createInputLabel({ name: "Email Address", required: true })}
                    placeholder="Enter email address"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                />

                {/* =========================================== */}
                {/* Phone Number */}
                {/* =========================================== */}
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label={createInputLabel({ name: "Phone Number", required: true })}
                            placeholder="Enter phone number"
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors.phone?.message}
                        />
                    )}
                />

                {/* =========================================== */}
                {/* Alternative Phone Number */}
                {/* =========================================== */}
                <Controller
                    name="altphone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            formGroupClass='col-span-2'
                            label={createInputLabel({ name: "Alternative Phone Number (Optional)", required: false })}
                            placeholder="Enter alternative phone number"
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors.altphone?.message}
                        />
                    )}
                />

                {/* =========================================== */}
                {/* Postcode Section with Lookup Button */}
                {/* =========================================== */}
                <div className="col-span-2! flex items-center gap-x-2">
                    <Input formGroupClass='flex-1' 
                    label={createInputLabel({ name: "Postcode", required: true })}
                    placeholder="Enter postcode" {...register('postcode')}
                    error={errors.postcode?.message}
                    />
                    <Button type="button" radius="md" className="text-white text-xs mt-3.5"
                        color='primary' onPress={handleLookupAddress} isLoading={isLookingUp} isDisabled={!postcodeValue.trim() || isLookingUp}>
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
                                value={field.value || ''}
                                onChange={(e) => {
                                    field.onChange(e)
                                    handleAddressSelect(e)
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                error={errors.selectedAddress?.message} >
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
                <>

                    <Input
                        formGroupClass='col-span-2'
                        label='Address Line 1'
                        placeholder="Enter address line 1"
                        {...register('addressline1')}
                        error={errors.addressline1?.message}
                    />

                    <Input
                        label='Address Line 2 (Optional)'
                        placeholder="Enter address line 2"
                        {...register('addressline2')}
                        error={errors.addressline2?.message}
                    />

                    <Input
                        label='Address Line 3 (Optional)'
                        placeholder="Enter address line 3"
                        {...register('addressline3')}
                        error={errors.addressline3?.message}
                    />

                    <Input
                        formGroupClass='col-span-2'
                        label='City'
                        placeholder="Enter city"
                        {...register('city')}
                        error={errors.city?.message}
                    />
                    
                </>
            </div>

            {/* =========================================== */}
            {/* Form Action Buttons */}
            {/* =========================================== */}
            <div className="flex gap-3 mt-7">

                <Button type="button" radius='md' variant='bordered'
                    className='border border-yellow text-yellow flex-1 text-xs h-11'
                    onPress={onPrevStep}>
                    Previous
                </Button>

                <Button type="submit" radius='md' className='bg-primary text-white flex-1 
                text-xs h-11' isLoading={isSubmitting}>
                    Save & Next
                </Button>

            </div>

        </form>
    )
}

export default RegStepTwo