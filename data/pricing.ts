import { PricingPlanType } from "@/types";

export const pricingPlans: PricingPlanType[] = [
    {
        id: 1,
        name: "Basic",
        description: "Perfect for small events and startups.",
        price: "$49",
        recommended: false,
        custom: false,
        features: [
            "Up to 1000 Transactions",
            "Basic Reporting",
            "Email Support",
            "Advanced Analytics",
        ],
    },
    {
        id: 2,
        name: "PRO",
        description: "Ideal for growing and businesses.",
        price: "$99",
        recommended: true,
        custom: false,
        features: [
            "Unlimited Transactions",
            "Advanced Reporting",
            "Priority Support",
            "Inventory Management",
        ],
    },
    {
        id: 3,
        name: "Enterprise",
        description: "For large-scale and custom needs.",
        price: "Custom",
        recommended: false,
        custom: true,
        features: [
            "All Pro Features",
            "Dedicated Account Manager",
            "On-site Support",
            "Custom Integrations",
        ],
    },
];

