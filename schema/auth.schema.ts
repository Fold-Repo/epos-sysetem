import * as yup from 'yup';

export const registrationStepOneSchema = yup.object({
    businessname: yup
        .string()
        .required('Business name is required')
        .min(2, 'Business name must be at least 2 characters'),
    businesstype: yup
        .string()
        .required('Type of business is required'),
    tin: yup
        .string()
        .required('TIN is required')
        .min(10, 'TIN must be at least 10 characters'),
    website: yup
        .string()
        .url('Please enter a valid website URL')
        .notRequired()
        .nullable()
        .default(undefined),
    business_registration_number: yup
        .string()
        .required('Business registration number is required'),
}).required();

export type RegistrationStepOneFormData = yup.InferType<typeof registrationStepOneSchema>;

export const registrationStepTwoSchema = yup.object({
    firstname: yup
        .string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastname: yup
        .string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: yup
        .string()
        .required('Email Address is required')
        .email('Please enter a valid email address'),
    phone: yup
        .string()
        .required('Phone Number is required'),
    altphone: yup
        .string()
        .notRequired()
        .nullable()
        .default(undefined),
    postcode: yup
        .string()
        .required('Postcode is required'),
    selectedAddress: yup
        .string()
        .notRequired()
        .nullable()
        .default(undefined),
    addressline1: yup
        .string()
        .required('Address line 1 is required'),
    addressline2: yup
        .string()
        .notRequired()
        .nullable()
        .default(undefined),
    addressline3: yup
        .string()
        .notRequired()
        .nullable()
        .default(undefined),
    city: yup
        .string()
        .required('City is required'),
}).required();

export type RegistrationStepTwoFormData = yup.InferType<typeof registrationStepTwoSchema>;

export const registrationStepThreeSchema = yup.object({
    product_service: yup
        .string()
        .required('Product/Service is required')
        .min(2, 'Product/Service must be at least 2 characters'),
    product_description: yup
        .string()
        .required('Brief Description of Products/Services is required')
        .min(10, 'Description must be at least 10 characters'),
    product_brochure: yup
        .mixed()
        .notRequired()
        .nullable(),
}).required();

export type RegistrationStepThreeFormData = yup.InferType<typeof registrationStepThreeSchema>;

export const registrationStepFourSchema = yup.object({
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

export const registrationStepFiveSchema = yup.object({
    terms_condition: yup
        .string()
        .required('You must agree to the Terms and Conditions')
        .oneOf(['yes'], 'You must agree to the Terms and Conditions'),
    certify_correct_data: yup
        .string()
        .required('You must certify that the information is accurate')
        .oneOf(['yes'], 'You must certify that the information is accurate'),
}).required();

export type RegistrationStepFiveFormData = yup.InferType<typeof registrationStepFiveSchema>;

export type RegistrationStepFourFormData = yup.InferType<typeof registrationStepFourSchema>;

export const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Password Reset Schemas
export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address'),
}).required();

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

export const otpVerificationSchema = yup.object({
    otp: yup
        .string()
        .required('Verification code is required')
        .length(6, 'Verification code must be 6 digits')
        .matches(/^\d+$/, 'Verification code must contain only numbers'),
}).required();

export type OTPVerificationFormData = yup.InferType<typeof otpVerificationSchema>;

export const createPasswordSchema = yup.object({
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

export type CreatePasswordFormData = yup.InferType<typeof createPasswordSchema>;

export const changePasswordSchema = yup.object({
    currentPassword: yup
        .string()
        .required('Current password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

