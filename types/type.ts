export type CustomButtonColorType =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"

export type FAQItemType = {
    category?: string;
    question: string;
    answer: string;
};

export type TestimonialType = {
    id: string | number
    name: string
    role: string
    image: string
    message: string
}

export type PricingPlanType = {
  id: number | string;
  name: string;
  description: string;
  price: string;
  recommended: boolean;
  custom: boolean;
  features: string[];
};

