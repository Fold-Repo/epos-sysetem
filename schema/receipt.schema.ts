import * as yup from 'yup';

export const receiptSettingsSchema = yup.object({
    // Display options
    showNote: yup.boolean().default(true),
    showAddress: yup.boolean().default(true),
    showBarcodeInReceipt: yup.boolean().default(true),
    showTax: yup.boolean().default(true),
    showPhone: yup.boolean().default(false),
    showEmail: yup.boolean().default(false),
    showLogoInPaymentSlip: yup.boolean().default(true),
    showCustomer: yup.boolean().default(false),
    showDiscountAndShipping: yup.boolean().default(false),
    showProductCode: yup.boolean().default(false),
    // Note text
    note: yup
        .string()
        .required('Note is required')
        .max(500, 'Note must not exceed 500 characters'),
}).required();

export type ReceiptSettingsFormData = yup.InferType<typeof receiptSettingsSchema>;

