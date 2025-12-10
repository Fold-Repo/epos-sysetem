import { useClickOutside } from "./useClickOutside";
import { useToast } from "./useToast";
import { useCountdown } from "./useCountdown";
import useGoBack from "./useGoBack";
import { useQueryParams } from "./useQueryParams";
import { usePermissions } from "./usePermissions";
import { useProductSelection, type BaseProductItem } from "./useProductSelection";
import { useOrderTotals } from "./useOrderTotals";

export {
    useClickOutside,
    useToast,
    useCountdown,
    useGoBack,
    useQueryParams,
    usePermissions,
    useProductSelection,
    useOrderTotals
}

export type { BaseProductItem }
export type { ItemWithSubtotal, OrderTotals } from "./useOrderTotals"