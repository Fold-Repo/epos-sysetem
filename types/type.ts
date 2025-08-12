export type CustomButtonColorType =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"

export type FAQItemType = {
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