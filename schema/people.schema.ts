import * as yup from 'yup';

export const supplierSchema = yup.object({
    name: yup
        .string()
        .required('Supplier name is required')
        .min(2, 'Supplier name must be at least 2 characters')
        .max(100, 'Supplier name must not exceed 100 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters'),
    phone: yup
        .string()
        .required('Phone is required')
        .max(20, 'Phone must not exceed 20 characters'),
    address: yup
        .string()
        .required('Address is required')
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
    firstname: yup
        .string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(100, 'First name must not exceed 100 characters'),
    lastname: yup
        .string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(100, 'Last name must not exceed 100 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters'),
    phone: yup
        .string()
        .required('Phone is required')
        .max(20, 'Phone must not exceed 20 characters'),
    role_id: yup
        .number()
        .required('Role is required')
        .typeError('Role is required'),
    store_id: yup
        .number()
        .required('Store is required')
        .typeError('Store is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

export type UserFormData = yup.InferType<typeof userSchema>;

