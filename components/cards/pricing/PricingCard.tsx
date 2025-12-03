import { Button } from '@/components';
import { PricingPlanType } from '@/types';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function PricingCard({ pricing }: { pricing: PricingPlanType }) {
    const { name, description, price, custom, recommended, features } = pricing || {};

    const cardContent = (
        <div className="relative rounded-2xl bg-white p-8 ring-1 ring-gray-200">

            <div className="space-y-1.5 text-center flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-black">{name}</h3>
                <p className="text-sm leading-6 text-gray-600">{description}</p>
                <p className="flex items-baseline gap-x-2">
                    <span className="text-3xl font-bold tracking-tight text-primary">{price}</span>
                    {!custom && <span className="text-base text-gray-500 font-medium">/ month</span>}
                </p>
            </div>

            <div className="flex justify-center mt-8 sm:mt-10 mb-16">
                <ul role="list" className="space-y-3 text-sm text-left">
                    {features?.map((feature) => (
                        <li key={feature} className="flex gap-x-3 text-black">
                            <CheckBadgeIcon className="size-5 flex-none text-success" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                size="lg"
                variant={recommended ? 'solid' : 'bordered'}
                className={`${recommended
                    ? 'bg-yellow text-white'
                    : 'border-1 border-yellow text-yellow hover:bg-yellow hover:text-white'
                    } w-full rounded-full`}>
                {custom ? 'Contact Sales' : 'Choose Plan'}
            </Button>

        </div>
    );

    return recommended ? (
        <div className="bg-yellow px-2 pb-2 pt-4 rounded-3xl">
            <h2 className="text-center font-medium text-sm pb-3">RECOMMENDED</h2>
            {cardContent}
        </div>
    ) : (
        cardContent
    );
}

