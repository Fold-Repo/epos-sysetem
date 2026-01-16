# Redesign Prompt: app.dfoldlab.co.uk

## Overview
This document outlines the comprehensive redesign requirements for **app.dfoldlab.co.uk** using the design language, feel, and color palette from **pp.dfoldlab.co.uk**. The redesign focuses on improving user experience, simplifying navigation, and enhancing visual consistency while maintaining all existing business logic and functionality.

---

## 1. Design Reference & Theme

### Color Palette & Visual Identity
- **Reference Site**: pp.dfoldlab.co.uk
- Extract and apply the exact color scheme, typography, button styles, spacing, and visual hierarchy from pp.dfoldlab.co.uk
- Maintain consistency in:
  - Border radius (rounded corners)
  - Shadows and depth
  - Background patterns/gradients
  - Icon styles
  - Form input styling
  - Button hover/active states

### Typography
- Use the same font families and weights as pp.dfoldlab.co.uk
- Maintain consistent text sizing hierarchy
- Ensure proper line heights and letter spacing

---

## 2. Landing Page Removal & Sign In as Default

### Current Behavior
- Landing page exists at `/` route showing HomeView component
- Users must navigate to `/signin` to access login

### New Behavior
- **Remove the landing page completely**
- When users visit **app.dfoldlab.co.uk** (root `/`), they should immediately see the **Sign In** page (if not authenticated)
- If user is already authenticated, redirect to `/dashboard` as usual
- Update routing structure:
  - Move `/signin` to be the default route `/`
  - Keep `/signup` route for registration
  - Update middleware to handle root route as signin

### Implementation Steps
1. Update `app/(landing)/page.tsx` to redirect to `/signin` or show LoginView
2. Update `proxy.ts` middleware to treat `/` as signin route
3. Remove or archive landing page components (optional, keep for reference)

---

## 3. Redesigned Sign In Page

### Requirements

#### Layout & Design
- Use the same visual style as pp.dfoldlab.co.uk
- Clean, minimal design with clear hierarchy
- Responsive design for mobile, tablet, and desktop

#### Form Elements
- **Email Input**: Styled consistently with reference site
- **Password Input**: With show/hide toggle
- **"Forgot Password?" link**: Positioned appropriately
- **Sign In Button**: Primary action button matching reference site style
- **Loading States**: Show loading indicator during authentication

#### Google Sign In Integration
- **"Sign in with Google" button**: 
  - Prominent placement (above or below email/password form)
  - Use Google brand colors and iconography
  - On click, trigger Google OAuth flow
  - After receiving `idToken` from Google, call: `POST /api/v1/auth/google/signin`
  - Payload: `{ "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZm..." }`
  - Handle success: Store token, redirect to dashboard
  - Handle errors: Display appropriate error messages

#### Navigation Links
- **"I'm New here? Sign Up"**: Link to `/signup` page
- Clear, accessible link styling

#### Error Handling
- Display validation errors inline
- Show server error messages appropriately
- Handle unverified account flow (redirect to verification)

---

## 4. Redesigned Sign Up Page

### Requirements

#### Layout & Design
- Match the visual style of pp.dfoldlab.co.uk
- Maintain the current multi-step registration flow (5 steps)
- Enhance visual design while keeping the same form structure

#### Form Steps (Maintain Current Structure)
1. **Business Info**: Business name, type, TIN, website, registration number
2. **Contact Details**: Name, email, phone, alt phone, address fields
3. **Products & Services**: Product/service info, description
4. **Password**: Password and confirm password
5. **Terms & Agreement**: Terms acceptance, certification

#### Google Sign Up Integration
- **"Sign up with Google" button**:
  - Place prominently (at the top of step 1 or as an alternative to email signup)
  - On click, trigger Google OAuth flow
  - After receiving `idToken` from Google, collect additional required fields:
    - Role (default: "business")
    - Phone number (required)
    - Position (default: "Owner")
    - All other fields from regular signup (business name, address, etc.)
  - Call: `POST /api/v1/auth/google/signup`
  - Payload structure:
    ```json
    {
      "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZm...",
      "role": "business",
      "phone": "+1234567890",
      "position": "Owner",
      "businessname": "...",
      "businesstype": "...",
      "firstname": "...",
      "lastname": "...",
      "email": "...",
      // ... all other signup fields
    }
    ```
  - Handle success: Store email, redirect to verification
  - Handle errors: Display appropriate error messages

#### Visual Enhancements
- Improve stepper component styling
- Better form field spacing and grouping
- Enhanced validation feedback
- Loading states for form submission

---

## 5. Google Authentication Implementation

### Google OAuth Setup
1. Install Google OAuth library: `@react-oauth/google` or use Google Identity Services
2. Configure Google OAuth client ID (environment variable)
3. Implement Google Sign-In button component

### API Integration

#### Google Sign In Endpoint
- **URL**: `POST /api/v1/auth/google/signin`
- **Payload**:
  ```typescript
  {
    idToken: string; // Google ID token
  }
  ```
- **Response**: Same structure as regular login (token, user data)
- **Error Handling**: Handle invalid tokens, expired tokens, etc.

#### Google Sign Up Endpoint
- **URL**: `POST /api/v1/auth/google/signup`
- **Payload**:
  ```typescript
  {
    idToken: string;
    role: string; // "business"
    phone: string;
    position: string;
    // All other registration fields
    businessname: string;
    businesstype: string;
    firstname: string;
    lastname: string;
    email: string;
    // ... etc
  }
  ```
- **Response**: Same structure as regular registration
- **Error Handling**: Handle duplicate accounts, validation errors, etc.

### Service Functions
Create new service functions in `services/auth.ts`:
- `googleSignIn(idToken: string)`
- `googleSignUp(payload: GoogleSignUpPayload)`

### Type Definitions
Add to `types/auth.type.ts`:
- `GoogleSignInPayload`
- `GoogleSignUpPayload`
- `GoogleSignInResponse`
- `GoogleSignUpResponse`

---

## 6. Dashboard Enhancements

### General Principles
- **DO NOT** change the layout structure, navigation, or business logic
- **DO** enhance visual design, readability, and user experience
- Maintain all existing functionality and data flows

### Table Component Enhancements

#### Visual Improvements
- **Alternating Row Colors**: Subtle background color alternation for better readability
- **Sticky Headers**: Table headers remain visible when scrolling
- **Hover States**: Row hover effects for better interactivity
- **Improved Spacing**: Better padding and margins for cells
- **Typography**: Enhanced font weights and sizes for better hierarchy
- **Border Styling**: Refined borders matching reference site style

#### Functional Enhancements
- **Loading States**: Better skeleton loaders matching new design
- **Empty States**: Improved "No data available" message styling
- **Responsive Design**: Better mobile/tablet table display (horizontal scroll, card view on mobile)
- **Sort Indicators**: Visual indicators for sortable columns
- **Filter UI**: Enhanced filter/search interface styling

#### Implementation
- Update `components/reusable/TableComponent.tsx` with new styling
- Apply consistent styling across all table instances:
  - Product tables
  - Sales tables
  - Purchase tables
  - Adjustment tables
  - Any other data tables

### Card Component Enhancements

#### Visual Improvements
- **Card Shadows**: Enhanced shadow effects matching reference site
- **Hover Effects**: Subtle hover animations/transitions
- **Border Radius**: Consistent rounded corners
- **Header Styling**: Improved card header with better typography
- **Content Spacing**: Better padding and margins
- **Color Scheme**: Apply reference site color palette

#### Functional Enhancements
- **Expand/Collapse**: Smooth animations for expandable cards
- **Loading States**: Better loading indicators
- **Empty States**: Improved empty state messaging
- **Action Buttons**: Enhanced button styling within cards

#### Implementation
- Update `components/reusable/DashboardCard.tsx` with new styling
- Apply enhancements to all card views:
  - Summary cards
  - View cards
  - Dashboard widgets
  - Any other card components

### View Card Mode Enhancements
- Improve the card view layout (when users switch from table to card view)
- Better grid spacing and responsive breakpoints
- Enhanced card content organization
- Improved image/product display in cards

---

## 7. Implementation Checklist

### Phase 1: Routing & Structure
- [ ] Update root route (`/`) to show Sign In page
- [ ] Update middleware to handle new routing
- [ ] Remove/redirect landing page components
- [ ] Test authentication flow

### Phase 2: Sign In Page Redesign
- [ ] Apply reference site design styles
- [ ] Implement Google Sign In button
- [ ] Integrate Google OAuth flow
- [ ] Add Google Sign In API service
- [ ] Test sign in with email and Google
- [ ] Update error handling and validation

### Phase 3: Sign Up Page Redesign
- [ ] Apply reference site design styles
- [ ] Enhance multi-step form visuals
- [ ] Implement Google Sign Up button
- [ ] Integrate Google OAuth flow for signup
- [ ] Add Google Sign Up API service
- [ ] Collect additional fields after Google auth
- [ ] Test sign up with email and Google
- [ ] Update error handling and validation

### Phase 4: Dashboard Enhancements
- [ ] Enhance TableComponent styling
- [ ] Update all table instances
- [ ] Enhance DashboardCard styling
- [ ] Update all card instances
- [ ] Improve view card mode
- [ ] Test responsive design
- [ ] Verify all functionality still works

### Phase 5: Testing & Polish
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [ ] Final design review against reference site

---

## 8. Technical Requirements

### Dependencies
- Install Google OAuth library: `@react-oauth/google` or use Google Identity Services
- Ensure all existing dependencies are compatible

### Environment Variables
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

### API Endpoints
- `POST /api/v1/auth/google/signin`
- `POST /api/v1/auth/google/signup`

### File Structure
```
app/
  (auth)/
    layout.tsx          # Auth layout (update styling)
    signin/
      page.tsx          # Sign In page (redesign)
    signup/
      page.tsx          # Sign Up page (redesign)
  dashboard/            # Keep as is, enhance components only

components/
  auth/
    GoogleSignInButton.tsx  # New component
    GoogleSignUpButton.tsx  # New component
  reusable/
    TableComponent.tsx      # Enhance styling
    DashboardCard.tsx       # Enhance styling

services/
  auth.ts                 # Add Google auth functions

types/
  auth.type.ts            # Add Google auth types
```

---

## 9. Design Consistency Guidelines

### Colors
- Extract exact color values from pp.dfoldlab.co.uk
- Use consistent color tokens throughout
- Ensure proper contrast ratios (WCAG AA minimum)

### Spacing
- Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, etc.)
- Match spacing from reference site

### Typography
- Match font families, sizes, weights, and line heights
- Ensure consistent text color hierarchy

### Components
- Buttons: Match style, size, padding, border radius
- Inputs: Match style, focus states, error states
- Cards: Match shadows, borders, padding
- Tables: Match styling, spacing, borders

---

## 10. Success Criteria

✅ Sign In page is the landing page (root route)  
✅ Sign In and Sign Up pages match pp.dfoldlab.co.uk design  
✅ Google Sign In and Sign Up work correctly  
✅ Dashboard tables are visually enhanced  
✅ Dashboard cards are visually enhanced  
✅ All existing functionality remains intact  
✅ Responsive design works on all devices  
✅ Accessibility standards are met  
✅ Design is consistent across all pages  

---

## Notes

- **Do not** change business logic or data flow
- **Do not** alter the dashboard layout structure
- **Do** focus on visual design and user experience improvements
- **Do** maintain all existing features and functionality
- **Do** test thoroughly after each phase

---

**Reference Sites:**
- Current: app.dfoldlab.co.uk
- Design Reference: pp.dfoldlab.co.uk

**API Base URL:** https://shorp-epos-backend.onrender.com/api/v1
