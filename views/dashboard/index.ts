import DashboardView from "./home";
import ProductsView from "./products";
import PaymentMtdView from "./payment-method";
import CurrencyView from "./currencies";
import ExpensesView from "./expenses";
export * from "./adjustment";
export * from "./quotations";
export * from "./transfer";
export * from "./purchases";
export * from "./purchase-returns";
export * from "./sales";
export * from "./sale-returns";
export * from "./people";
export * from "./roles";
export * from "./stores";
export * from "./reports";
export { default as CreateUserView } from "./people/users/create";
export { default as EditUserView } from "./people/users/edit";
export { default as CreateRoleView } from "./roles/create";
export { default as EditRoleView } from "./roles/edit";
export { default as CreateProductView } from "./products/create";
export { default as SettingsView } from "./settings";

export {
    DashboardView,
    ProductsView,
    PaymentMtdView,
    CurrencyView,
    ExpensesView,
}