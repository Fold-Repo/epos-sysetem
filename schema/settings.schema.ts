import * as yup from 'yup';

export const settingsSchema = yup.object({
    // Company details
    companyName: yup
        .string()
        .required('Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name must not exceed 100 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters'),
    phone: yup
        .string()
        .required('Phone is required')
        .max(20, 'Phone must not exceed 20 characters'),
    // Logo settings
    logo: yup
        .mixed<FileList>()
        .optional()
        .nullable()
        .test('file-size', 'File size must be less than 5MB', (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true
            return Array.from(value).every(file => file.size <= 5 * 1024 * 1024)
        })
        .test('file-type', 'Only image files are allowed', (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true
            return Array.from(value).every(file => file.type.startsWith('image/'))
        }),
    // Address fields with lookup
    postcode: yup
        .string()
        .required('Postcode is required'),
    selectedAddress: yup
        .string()
        .required('Please select an address'),
    line1: yup
        .string()
        .notRequired()
        .default(undefined),
    line2: yup
        .string()
        .notRequired()
        .default(undefined),
    town: yup
        .string()
        .notRequired()
        .default(undefined),
    city: yup
        .string()
        .required('City is required'),
    country: yup
        .string()
        .optional()
        .default('')
        .max(100, 'Country must not exceed 100 characters'),
    state: yup
        .string()
        .optional()
        .default('')
        .max(100, 'State must not exceed 100 characters'),
}).required();

export type SettingsFormData = yup.InferType<typeof settingsSchema>;

