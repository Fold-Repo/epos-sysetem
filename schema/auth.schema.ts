import * as yup from 'yup';

export const registrationStepOneSchema = yup.object({
    businessName: yup
        .string()
        .required('Business name is required')
        .min(2, 'Business name must be at least 2 characters'),
    businessType: yup
        .string()
        .required('Type of business is required')
        .oneOf(
            ['sole-proprietorship', 'partnership', 'corporation', 'llc'],
            'Please select a valid business type'
        ),
    taxId: yup
        .string()
        .required('Tax Identification Number is required'),
    website: yup
        .string()
        .url('Please enter a valid website URL')
        .notRequired()
        .default(undefined),
    businessRegistrationNumber: yup
        .string()
        .notRequired()
        .default(undefined),
}).required();

export type RegistrationStepOneFormData = yup.InferType<typeof registrationStepOneSchema>;

export const registrationStepTwoSchema = yup.object({
    primaryContactPerson: yup
        .string()
        .required('Primary Contact Person is required')
        .min(2, 'Primary Contact Person must be at least 2 characters'),
    emailAddress: yup
        .string()
        .required('Email Address is required')
        .email('Please enter a valid email address'),
    phoneNumber: yup
        .string()
        .required('Phone Number is required'),
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
}).required();

export type RegistrationStepTwoFormData = yup.InferType<typeof registrationStepTwoSchema>;

export const registrationStepThreeSchema = yup.object({
    categories: yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one category')
        .required('Category of Goods/Services is required'),
    description: yup
        .string()
        .required('Brief Description of Products/Services is required')
        .min(10, 'Description must be at least 10 characters'),
    catalog: yup
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
    agreeToTerms: yup
        .boolean()
        .required('You must agree to the Terms and Conditions')
        .oneOf([true], 'You must agree to the Terms and Conditions'),
    consentToMarketing: yup
        .boolean()
        .notRequired()
        .default(false),
    certifyInformation: yup
        .boolean()
        .required('You must certify that the information is accurate')
        .oneOf([true], 'You must certify that the information is accurate'),
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
        .min(6, 'Password must be at least 6 characters'),
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
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

