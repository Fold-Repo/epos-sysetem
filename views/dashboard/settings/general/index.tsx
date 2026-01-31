'use client'

import { createInputLabel, Input, PhoneInput, ProfilePictureUpload, createFileLabel, Select } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@/hooks'
import { companyProfileSchema, CompanyProfileFormData } from '@/schema'
import { DashboardCard } from '@/components'
import { LOGO } from '@/constants'
import { useState, useEffect } from 'react'
import { useGetAddressSuggestions, useGetAddressDetails, updateProfile, uploadImage } from '@/services'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store/hooks'
import { selectProfile, fetchProfile } from '@/store/slice'
import { getErrorMessage } from '@/utils'
import { UPLOAD_FOLDER } from '@/types'
import type { UpdateProfilePayload } from '@/types'

const GeneralSettingsView = () => {
    const dispatch = useAppDispatch()
    const { showSuccess, showError } = useToast()
    const profile = useSelector(selectProfile)
    const [logoUploading, setLogoUploading] = useState(false)

    const [postcodeToLookup, setPostcodeToLookup] = useState<string>('')
    const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [showAddressDropdown, setShowAddressDropdown] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

    const business = profile?.business
    const user = profile?.user
    const address = profile?.address

    const form = useForm<CompanyProfileFormData>({
        resolver: yupResolver(companyProfileSchema) as never,
        mode: 'onChange',
        defaultValues: {
            logo: '',
            postcode: '',
            selectedAddress: '',
            line1: '',
            line2: '',
            town: '',
            city: '',
            country: '',
        },
    })

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = form
    const postcodeValue = watch('postcode') || ''

    // ===========================================
    // Populate form from profile
    // ===========================================
    useEffect(() => {
        if (!profile) return
        reset({
            logo: business?.logo ?? '',
            postcode: address?.postcode ?? '',
            selectedAddress: '',
            line1: address?.addressline1 ?? '',
            line2: address?.addressline2 ?? '',
            town: address?.addressline3 ?? '',
            city: address?.city ?? '',
            country: address?.country ?? '',
        })
    }, [profile, business?.logo, address, reset])

    // ===========================================
    // Address Suggestions
    // ===========================================
    const {
        data: addressSuggestions = [],
        isLoading: isLookingUp,
        error: suggestionsError,
    } = useGetAddressSuggestions(postcodeToLookup, shouldFetchSuggestions)

    const { data: addressDetails, error: detailsError } = useGetAddressDetails(selectedAddressId, !!selectedAddressId)

    const handleLookupAddress = () => {
        const postcode = postcodeValue.trim()
        if (!postcode) {
            showError('Please enter a postcode')
            return
        }
        setPostcodeToLookup(postcode)
        setShouldFetchSuggestions(true)
        setSelectedAddressId('')
        setShowAddressDropdown(false)
        setShowAddressFields(false)
        setValue('selectedAddress', '')
        // Keep existing address fields until lookup succeeds – they’re updated in the addressDetails effect
    }

    const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addressId = e.target.value
        if (!addressId) {
            setSelectedAddressId('')
            setShowAddressFields(false)
            return
        }
        setSelectedAddressId(addressId)
    }

    useEffect(() => {
        if (addressSuggestions.length > 0) {
            setShowAddressDropdown(true)
        } else if (postcodeToLookup && !isLookingUp && shouldFetchSuggestions) {
            setShowAddressDropdown(false)
        }
        if (!isLookingUp && shouldFetchSuggestions && (suggestionsError || addressSuggestions.length === 0)) {
            setShouldFetchSuggestions(false)
        }
    }, [addressSuggestions, isLookingUp, postcodeToLookup, shouldFetchSuggestions, suggestionsError])

    useEffect(() => {
        if (suggestionsError) {
            showError(suggestionsError instanceof Error ? suggestionsError.message : 'Failed to lookup address. Please try again.')
            setShowAddressDropdown(false)
        }
    }, [suggestionsError, showError])

    useEffect(() => {
        if (addressDetails) {
            setShowAddressFields(true)
            setValue('line1', addressDetails.line_1 || '')
            setValue('line2', addressDetails.line_2 || '')
            setValue('town', addressDetails.town_or_city || addressDetails.locality || '')
            setValue('city', addressDetails.town_or_city || addressDetails.locality || '')
            setValue('country', addressDetails.country || '')
            setValue('postcode', addressDetails.postcode || '')
        }
    }, [addressDetails, setValue])

    useEffect(() => {
        if (detailsError) {
            showError(detailsError instanceof Error ? detailsError.message : 'Failed to fetch address details. Please try again.')
            setShowAddressFields(false)
        }
    }, [detailsError, showError])

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setLogoUploading(true)
            const uploaded = await uploadImage({
                images: file,
                folders: UPLOAD_FOLDER.BUSINESS,
            })
            if (uploaded[0]?.url) {
                setValue('logo', uploaded[0].url, { shouldDirty: true })
            }
        } catch (error) {
            showError(getErrorMessage(error))
        } finally {
            setLogoUploading(false)
            e.target.value = ''
        }
    }

    const handleFormSubmit = async (data: CompanyProfileFormData) => {
        try {
            const payload: UpdateProfilePayload = {}
            if (data.logo) payload.logo = data.logo
            if (data.line1 || data.line2 || data.town || data.city || data.country || data.postcode) {
                payload.address = {
                    addressline1: data.line1 || '',
                    addressline2: data.line2 || null,
                    addressline3: data.town || null,
                    city: data.city || '',
                    country: data.country || '',
                    postcode: data.postcode || '',
                }
            }
            await updateProfile(payload)
            dispatch(fetchProfile())
            showSuccess(
                'Company details updated',
                'Your company settings have been updated successfully.'
            )
        } catch (error) {
            showError(getErrorMessage(error))
        }
    }

    if (!profile) {
        return (
            <div className="space-y-6">
                <DashboardCard bodyClassName="p-5" title="Company Details">
                    <p className="text-gray-500">Loading profile…</p>
                </DashboardCard>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <DashboardCard bodyClassName="p-5" title="Company Details">
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-6">

                    {/* Company Logo */}
                    <div className="mb-1">
                        <Controller
                            name="logo"
                            control={control}
                            render={({ field }) => (
                                <ProfilePictureUpload
                                    label={createFileLabel({ name: 'Company Logo', required: false })}
                                    labelClassName="font-medium mb-3"
                                    name="logo"
                                    value={field.value as string | null}
                                    onChange={handleLogoChange}
                                    error={errors.logo?.message as string}
                                    defaultImage={LOGO.logo_1}
                                />
                            )}
                        />
                        {logoUploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
                    </div>

                    {/* Company info (read-only from profile) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            name="companyName"
                            label={createInputLabel({ name: 'Company Name', required: false })}
                            placeholder="Company name"
                            value={business?.businessname ?? ''}
                            disabled
                        />
                        <Input
                            name="email"
                            label={createInputLabel({ name: 'Email', required: false })}
                            type="email"
                            placeholder="Email"
                            value={user?.email ?? ''}
                            disabled
                        />
                        <PhoneInput
                            name="phone"
                            label={createInputLabel({ name: 'Phone', required: false })}
                            placeholder="Enter phone number"
                            value={user?.phone ?? ''}
                            disabled
                            className='disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
                        />
                    </div>

                    {/* Postcode + Lookup */}
                    <div className="flex items-center gap-x-2">
                        <Input
                            formGroupClass="flex-1"
                            label={createInputLabel({ name: 'Postcode', required: false })}
                            placeholder="Enter postcode"
                            {...register('postcode')}
                            error={errors.postcode?.message}
                        />
                        <Button
                            type="button"
                            radius="md"
                            className="text-white text-xs mt-3.5"
                            color="primary"
                            onPress={handleLookupAddress}
                            isLoading={isLookingUp}
                            isDisabled={!postcodeValue.trim() || isLookingUp}
                        >
                            Lookup Address
                        </Button>
                    </div>

                    {/* Address selection (after lookup) */}
                    {showAddressDropdown && addressSuggestions.length > 0 && (
                        <Controller
                            name="selectedAddress"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    formGroupClass="col-span-2"
                                    label={createInputLabel({ name: 'Address', required: false })}
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleAddressSelect(e)
                                    }}
                                    error={errors.selectedAddress?.message}
                                >
                                    <option value="">Select Address</option>
                                    {addressSuggestions.map((suggestion, index) => (
                                        <option key={index} value={suggestion.id}>
                                            {suggestion.address}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                    )}

                    {/* Address fields (editable; filled from profile or lookup) */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Address line 1"
                                placeholder="Line 1"
                                {...register('line1')}
                                error={errors.line1?.message}
                            />
                            <Input
                                label="Address line 2"
                                placeholder="Line 2"
                                {...register('line2')}
                                error={errors.line2?.message}
                            />
                            <Input
                                label="Town / Line 3"
                                placeholder="Town"
                                {...register('town')}
                                error={errors.town?.message}
                            />
                            <Input
                                label="City"
                                placeholder="City"
                                {...register('city')}
                                error={errors.city?.message}
                            />
                            <Input
                                label="Country"
                                placeholder="Country"
                                {...register('country')}
                                error={errors.country?.message}
                            />
                            <Input
                                name="postcodeDisplay"
                                label="Postcode"
                                placeholder="Postcode"
                                value={postcodeValue}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            type="submit"
                            radius="md"
                            className="px-6 bg-primary text-white text-xs h-10"
                            isLoading={isSubmitting}
                        >
                            Update Company Details
                        </Button>
                    </div>
                </form>
            </DashboardCard>
        </div>
    )
}

export default GeneralSettingsView
