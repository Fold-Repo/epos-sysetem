'use client'

import IncomeOverview from './IncomeOverview'
import ProfitLossTrend from './ProfitLossTrend'

const ChartViewTab = () => {
    return (
        <div className="space-y-6">

            <IncomeOverview />
            
            <ProfitLossTrend />

        </div>
    )
}

export default ChartViewTab

