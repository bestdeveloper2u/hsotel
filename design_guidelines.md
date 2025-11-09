# Design Guidelines: Hostel Management System

## Design Approach: Material Design System

**Rationale**: This is a data-intensive, multi-role management platform requiring clear information hierarchy, extensive form handling, and complex table views. Material Design provides robust patterns for enterprise applications with strong data visualization and component clarity.

## Typography

**Font Family**: Roboto (via Google Fonts CDN)
- Headings: Roboto Medium (500) and Bold (700)
- Body: Roboto Regular (400)
- Data/Tables: Roboto Regular (400)
- UI Elements: Roboto Medium (500)

**Type Scale**:
- Page Titles: text-3xl (30px)
- Section Headers: text-2xl (24px)
- Card/Panel Headers: text-xl (20px)
- Body Text: text-base (16px)
- Captions/Labels: text-sm (14px)
- Table Data: text-sm (14px)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Card margins: m-4
- Form field spacing: space-y-4

**Grid Structure**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Data tables: Full-width with horizontal scroll on mobile
- Forms: Single column (max-w-2xl) for registration, two-column (grid-cols-2) for shorter forms
- Navigation: Fixed sidebar (w-64) on desktop, collapsible drawer on mobile

## Core Component Library

### Navigation
- **Primary Sidebar**: Fixed left navigation (264px wide) with role-based menu items, collapsible sections for sub-menus
- **Top Bar**: App title, user profile dropdown, notifications bell icon
- **Breadcrumbs**: Show current location in hierarchy (Home > User Management > Edit User)

### Dashboards
- **Stat Cards**: Elevated cards with large numbers, labels, and trend indicators (grid layout)
- **Quick Actions**: Icon buttons with labels in prominent card
- **Recent Activity**: List view with timestamps and user avatars
- **Charts**: Use recharts library for meal tracking trends, payment summaries

### Data Tables
- **Structure**: Sticky header, alternating row backgrounds (subtle), action column on right
- **Features**: Sortable columns, search/filter bar above table, pagination below
- **Row Actions**: Icon buttons (edit, delete, view) with tooltips
- **Bulk Actions**: Checkboxes in first column, action bar appears when items selected

### Forms
- **Input Fields**: Outlined style with floating labels, helper text below
- **Structure**: Logical grouping in cards/sections with section titles
- **Buttons**: Primary (filled), Secondary (outlined), positioned bottom-right of form
- **Validation**: Inline error messages below fields, error summary at top for multi-step forms

### Registration Flows
- **Multi-Step Forms**: Progress indicator at top, prev/next navigation at bottom
- **Entity Types**: Radio button selection for Individual/Hostel/Corporate at start
- **Document Upload**: Drag-and-drop zone with file preview

### Role Management
- **Permission Matrix**: Table with roles as rows, permissions as columns, checkbox toggles
- **Role Cards**: Display role name, description, member count, quick edit/delete actions

### Payment Integration
- **Payment Cards**: Display plan details, pricing, Stripe card input component
- **Transaction History**: Sortable table with date, amount, status, receipt download

### Feedback System
- **Star Rating**: 5-star clickable rating with hover states
- **Comment Box**: Text area with character counter
- **Category Selection**: Dropdown or radio buttons for feedback type

## Icons

**Library**: Material Icons (via Google Fonts CDN)
- Navigation: home, dashboard, people, business, restaurant, payments, feedback, settings
- Actions: edit, delete, add, search, filter, download, upload
- Status: check_circle, error, warning, info

## Layout Patterns

### Super Admin Dashboard
- Three-column stat cards (total users, active hostels, monthly revenue)
- Quick actions card with "Create Role", "Add User", "View Reports"
- Recent registrations table (5 rows)
- System alerts/notifications panel

### User Management View
- Search and filter bar with role dropdown, status filter
- Data table with columns: Name, Email, Role, Entity, Status, Actions
- Bulk actions: Assign Role, Activate/Deactivate, Export

### Hostel Profile
- Two-column layout: Left (hostel details card), Right (member list + meal stats)
- Tabs for Members, Meal Plans, Payments, Settings

### Meal Tracking Interface
- Calendar view with daily meal markers
- Quick entry form: Select member, meal type (breakfast/lunch/dinner), date
- Monthly summary chart

## Responsive Behavior
- Desktop (lg): Full sidebar + main content
- Tablet (md): Collapsible sidebar, grid cards reduce to 2 columns
- Mobile (base): Hamburger menu, single column layouts, horizontal scroll tables

## Animations
Minimal, functional only:
- Sidebar collapse/expand: 200ms ease
- Dropdown menus: 150ms fade-in
- Form validation: Shake animation on error (300ms)
- No scroll-based or decorative animations

This design creates a professional, efficient management platform with clear hierarchy and role-appropriate interfaces for all user types.