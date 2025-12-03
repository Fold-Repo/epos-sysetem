import { Footer, Navbar } from '@/components'
import { HomeBanner } from './components'
import { AutomateOperations, FAQSection, PosSolutionOption, SaleMadeSimple, ScheduleCall, SellSmarter, SupportingBusinesses, WhatClientSays } from './sections'

const HomeView = () => {
    return (
        <>

            <Navbar />

            <HomeBanner />

            <div className="pt-6 space-y-10">

                <ScheduleCall />

                <SaleMadeSimple />

                <AutomateOperations />

                <PosSolutionOption />

                <FAQSection />

                <SupportingBusinesses />

                <WhatClientSays />

                <SellSmarter />

            </div>

            <Footer />

        </>
    )
}

export default HomeView

