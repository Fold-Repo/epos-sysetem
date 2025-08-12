'use client'

import { useRouter } from 'next/navigation'

/**
 * Custom hook to navigate back to the previous page.
 *
 * @returns A function that triggers router.back().
 *
 * @example
 * const goBack = useGoBack();
 * <button onClick={goBack}>Go Back</button>
 */
const useGoBack = () => {
    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    return goBack
}

export default useGoBack
