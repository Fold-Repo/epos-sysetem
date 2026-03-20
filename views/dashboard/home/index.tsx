"use client"

import { Button, DashboardBreadCrumb, MetricCard, TrendIndicator } from '@/components'
import { formatCurrency } from '@/lib';
import {
    BuildingStorefrontIcon,
    UserGroupIcon,
    BanknotesIcon
} from '@heroicons/react/24/solid';
import { LuChartSpline } from 'react-icons/lu';
import { RecentSales, RevenueBreakdown, RevenueDistribution, StockAlert, WeeklySales } from './sections';
import { useGetSummaryCards, createBusinessOnboardLink, getBusinessOnboardLink } from '@/services';
import { useEffect, useMemo, useState } from 'react';
import { usePersonaVerification } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectBusinessConnectStatus, selectProfile } from '@/store/slice';
import { useToast } from '@/hooks';
import { buildStripeOnboardingReturnUrl, clearStripeOnboardingSuccessPending, createStripeOneTimeToken, getErrorMessage, markStripeOnboardingSuccessPending, shouldOpenStripeOnboardingSuccessModal } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import StripeConnectionSuccessModal from '@/components/dashboard/StripeConnectionSuccessModal';

const DashboardView = () => {

    // ================================
    // FETCH SUMMARY CARDS
    // ================================
    const { data: summaryData, isLoading } = useGetSummaryCards()

    // ================================
    // PERSONA VERIFICATION
    // ================================
    const { startVerification, isVerifying } = usePersonaVerification();
    const profile = useAppSelector(selectProfile);
    const personaVerified = profile?.user?.persona_verified;
    const [onboardingLoading, setOnboardingLoading] = useState(false);
    const { showError } = useToast();
    const connectStatus = useAppSelector(selectBusinessConnectStatus);
    const hasStripeConnected = Boolean(connectStatus?.stripe_account_id);
    const stripeOnboardingCompleted = Boolean(connectStatus?.stripe_onboarding_completed);

    const connectButtonDisabled = stripeOnboardingCompleted;
    const connectButtonText = stripeOnboardingCompleted
        ? 'Connected'
        : 'Continue stripe onboarding';

    const router = useRouter();
    const searchParams = useSearchParams();
    const onboardingSuccess = searchParams.get('success') === 'true';
    const onboardingSuccessToken = searchParams.get('token');
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => {
        const shouldOpen = shouldOpenStripeOnboardingSuccessModal({
            onboardingSuccess,
            tokenQuery: onboardingSuccessToken,
            stripeOnboardingCompleted,
        });

        if (!shouldOpen) return;
        setSuccessModalOpen(true);
        clearStripeOnboardingSuccessPending();
    }, [onboardingSuccess, onboardingSuccessToken, stripeOnboardingCompleted]);

    // ================================
    // METRICS DATA
    // ================================
    const metricsData = useMemo(() => {
        if (!summaryData || isLoading) {
            return [
                {
                    title: "Total Sales",
                    value: formatCurrency(0),
                    colorClass: "text-[#16A34A]",
                    icon: <LuChartSpline className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Total Purchases",
                    value: formatCurrency(0),
                    colorClass: "text-[#2563EB]",
                    icon: <BuildingStorefrontIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Sales Return",
                    value: formatCurrency(0),
                    colorClass: "text-[#9333EA]",
                    icon: <BanknotesIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                },
                {
                    title: "Today's Sales",
                    value: formatCurrency(0),
                    colorClass: "text-[#EA580C]",
                    icon: <UserGroupIcon className='size-4' />,
                    trend: 'up' as const,
                    percentage: 0,
                    description: "from last month"
                }
            ]
        }

        const getTrend = (percentageChange: number): 'up' | 'down' => {
            return percentageChange >= 0 ? 'up' : 'down'
        }

        return [
            {
                title: "Total Sales",
                value: formatCurrency(summaryData.totalSales.value),
                colorClass: "text-[#16A34A]",
                icon: <LuChartSpline className='size-4' />,
                trend: getTrend(summaryData.totalSales.percentage_change),
                percentage: Math.abs(summaryData.totalSales.percentage_change),
                description: "from last month"
            },
            {
                title: "Total Purchases",
                value: formatCurrency(summaryData.totalPurchases.value),
                colorClass: "text-[#2563EB]",
                icon: <BuildingStorefrontIcon className='size-4' />,
                trend: getTrend(summaryData.totalPurchases.percentage_change),
                percentage: Math.abs(summaryData.totalPurchases.percentage_change),
                description: "from last month"
            },
            {
                title: "Sales Return",
                value: formatCurrency(summaryData.salesReturn.value),
                colorClass: "text-[#9333EA]",
                icon: <BanknotesIcon className='size-4' />,
                trend: getTrend(summaryData.salesReturn.percentage_change),
                percentage: Math.abs(summaryData.salesReturn.percentage_change),
                description: "from last month"
            },
            {
                title: "Today's Sales",
                value: formatCurrency(summaryData.todaySales.value),
                colorClass: "text-[#EA580C]",
                icon: <UserGroupIcon className='size-4' />,
                trend: getTrend(summaryData.todaySales.percentage_change),
                percentage: Math.abs(summaryData.todaySales.percentage_change),
                description: "from last month"
            }
        ]
    }, [summaryData, isLoading])

    const handleConnectAccount = async () => {
        
        if (onboardingLoading) return;
        if (connectButtonDisabled) return;

        if (!personaVerified) {
            showError("Please verify identity before connecting your account.");
            return;
        }

        setOnboardingLoading(true);

        try {
            // Generate a one-time token so only a real redirect from our onboarding flow opens the modal.
            const token = createStripeOneTimeToken();

            const returnUrl = buildStripeOnboardingReturnUrl(window.location.origin, token);
            const refreshUrl = `${window.location.origin}/dashboard`;

            // Mark "pending success" so only the user who initiated onboarding
            // will see the success modal when Stripe redirects back.
            markStripeOnboardingSuccessPending(token)

            // ======================================================
            // GET BUSINESS ONBOARD LINK
            // ======================================================
            const res = hasStripeConnected
                ? await getBusinessOnboardLink()
                : await createBusinessOnboardLink({ return_url: returnUrl, refresh_url: refreshUrl });

            const url = res?.data?.onboarding_url;

            // ======================================================
            // CHECK IF ONBOARDING URL IS RETURNED
            // ======================================================
            if (!url) {
                showError(res?.message || "Onboarding url not returned.");
                return;
            }

            // ======================================================
            // OPEN ONBOARDING URL IN NEW TAB
            // ======================================================
            window.open(url, "_blank", "noopener,noreferrer");

        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setOnboardingLoading(false);
        }

    };

    return (
        <>

            <DashboardBreadCrumb
                title="Dashboard"
                description="Welcome back! Here's what's happening with your store today."
                endContent={
                    <div className='flex items-center gap-2'>

                        { !personaVerified ? (
                            <Button size='sm' className='bg-primary text-white h-9 px-4 text-[11px]'
                                onPress={() => startVerification()} isLoading={isVerifying}
                                isDisabled={isVerifying}>
                                Verify Identity
                            </Button>
                        ) : null}

                        <Button size='sm' className='bg-primary text-white h-9 px-4 text-[11px]'
                            onPress={handleConnectAccount} isLoading={onboardingLoading}
                            title={!personaVerified ? 'Verify Identity before connecting your account' : connectButtonText}
                            isDisabled={onboardingLoading || connectButtonDisabled || !personaVerified}>
                            {connectButtonText}
                        </Button>

                    </div>
                }
            />

            <StripeConnectionSuccessModal
                isOpen={successModalOpen}
                onClose={() => {
                    setSuccessModalOpen(false)
                    router.replace('/dashboard')
                    clearStripeOnboardingSuccessPending()
                }}
            />

            <div className="p-3 space-y-3">

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {metricsData.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            colorClass={metric.colorClass}
                            icon={metric.icon}>
                            <TrendIndicator
                                trend={metric.trend}
                                percentage={metric.percentage}
                                description={metric.description}
                            />
                        </MetricCard>
                    ))}
                </div>

                {/* ================= WEEKLY SALES ================= */}
                <WeeklySales />

                {/* =========== REVENUE DISTRIBUTION / BREAKDOWN =========== */}
                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="w-full lg:w-[50%]">
                        <RevenueDistribution />
                    </div>

                    <div className="w-full lg:w-[50%]">
                        <RevenueBreakdown />
                    </div>

                </div>

                {/* ================= RECENT SALES ================= */}
                <RecentSales />

                {/* ================= STOCK ALERT ================= */}
                <StockAlert />

            </div>

        </>
    )
}

export default DashboardView