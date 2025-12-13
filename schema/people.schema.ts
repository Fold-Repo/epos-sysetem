import * as yup from 'yup';

export const supplierSchema = yup.object({
    name: yup
        .string()
        .required('Supplier name is required')
        .min(2, 'Supplier name must be at least 2 characters')
        .max(100, 'Supplier name must not exceed 100 characters'),
    email: yup
        .string()
        .optional()
        .default('')
        .test('email-format', 'Invalid email format', (value) => {
            if (!value || value.length === 0) return true
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        })
        .max(100, 'Email must not exceed 100 characters'),
    phone: yup
        .string()
        .optional()
        .default('')
        .max(20, 'Phone must not exceed 20 characters'),
    country: yup
        .string()
        .optional()
        .default('')
        .max(100, 'Country must not exceed 100 characters'),
    city: yup
        .string()
        .optional()
        .default('')
        .max(100, 'City must not exceed 100 characters'),
    address: yup
        .string()
        .optional()
        .default('')
        .max(500, 'Address must not exceed 500 characters'),
}).required();

export type SupplierFormData = yup.InferType<typeof supplierSchema>;

export const customerSchema = yup.object({
    name: yup
        .string()
        .required('Customer name is required')
        .min(2, 'Customer name must be at least 2 characters')
        .max(100, 'Customer name must not exceed 100 characters'),
    email: yup
        .string()
        .optional()
        .default('')
        .test('email-format', 'Invalid email format', (value) => {
            if (!value || value.length === 0) return true
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        })
        .max(100, 'Email must not exceed 100 characters'),
    phone: yup
        .string()
        .optional()
        .default('')
        .max(20, 'Phone must not exceed 20 characters'),
    country: yup
        .string()
        .optional()
        .default('')
        .max(100, 'Country must not exceed 100 characters'),
    city: yup
        .string()
        .optional()
        .default('')
        .max(100, 'City must not exceed 100 characters'),
    address: yup
        .string()
        .optional()
        .default('')
        .max(500, 'Address must not exceed 500 characters'),
}).required();

export type CustomerFormData = yup.InferType<typeof customerSchema>;

export const userSchema = yup.object({
    name: yup
        .string()
        .required('User name is required')
        .min(2, 'User name must be at least 2 characters')
        .max(100, 'User name must not exceed 100 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters'),
    role: yup
        .string()
        .required('Role is required')
        .max(50, 'Role must not exceed 50 characters'),
    phone: yup
        .string()
        .required('Phone is required')
        .max(20, 'Phone must not exceed 20 characters'),
    stores: yup
        .array()
        .of(yup.string().required())
        .required('At least one store is required')
        .min(1, 'At least one store is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    profilePicture: yup
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
}).required();

export type UserFormData = yup.InferType<typeof userSchema>;

