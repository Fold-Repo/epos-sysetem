import { ProductVariationType } from "@/types";

export const variationsData: ProductVariationType[] = [
    {
        id: 'var-1',
        name: 'Colors',
        type: 'Color',
        variationTypes: [
            { name: 'Red', color: '#FF0000' },
            { name: 'Green', color: '#00FF00' },
            { name: 'Blue', color: '#0000FF' },
            { name: 'Black', color: '#000000' },
            { name: 'Yellow', color: '#FFFF00' }
        ],
        created_at: '2023-01-10',
        last_modified: '2024-03-01',
    },
    {
        id: 'var-2',
        name: 'Size',
        type: 'Size',
        variationTypes: ['X', 'XL', 'XXL', 'M'],
        created_at: '2023-02-15',
        last_modified: '2024-02-28',
    },
    {
        id: 'var-3',
        name: 'Material',
        type: 'Other',
        variationTypes: ['Cotton', 'Polyester', 'Wool', 'Silk'],
        created_at: '2023-03-20',
        last_modified: '2024-01-15'
    }
];

