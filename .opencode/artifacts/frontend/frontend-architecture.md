# Frontend Architecture - Hospital Management System

## Stack
- Framework: React 18 + TypeScript
- Build Tool: Vite 5
- Styling: Tailwind CSS 3 + CSS Custom Properties (theme.css)
- Routing: React Router DOM 6
- State Management: React Context (Auth) + local component state + mutable service state

## Component Registry

| Component | Location | Props | Used By |
|---|---|---|---|
| Avatar | shared/components/ui/Avatar.tsx | name, surname, id, size | All screens with patient/employee lists |
| Badge | shared/components/ui/Badge.tsx | children, variant, size, pill | Queue status, role labels |
| Button | shared/components/ui/Button.tsx | variant, size, icon, children | All screens |
| Modal | shared/components/ui/Modal.tsx | isOpen, onClose, title, children, maxWidth | Employee form, Add to queue, Create prescription |
| ConfirmDialog | shared/components/ui/ConfirmDialog.tsx | isOpen, onClose, onConfirm, title, message, confirmLabel | Delete confirmations |
| SearchInput | shared/components/ui/SearchInput.tsx | (extends InputHTMLAttributes) | Patient search, Employee list |
| EmptyState | shared/components/ui/EmptyState.tsx | icon, message, action | Empty tables/lists |
| Sidebar | shared/components/layout/Sidebar.tsx | (uses useAuth) | All authenticated screens |
| Header | shared/components/layout/Header.tsx | (uses useAuth) | All authenticated screens |
| AppLayout | shared/components/layout/AppLayout.tsx | Outlet | All authenticated routes |

## Screen Implementation Status

| # | Screen | Route | Status |
|---|---|---|---|
| 1 | Login | /login | implementada |
| 2 | Cola OPD (Recepcionist) | /opd-queue | implementada |
| 3 | Cola OPD (Doctor) | /opd-queue | implementada |
| 4 | Patient Search | /patients/search | implementada |
| 5 | Patient Register | /patients/register | implementada |
| 6 | Patient Detail | /patients/:id | implementada |
| 7 | OPD Visit Detail | /opd/:id | implementada |
| 8 | Create Prescription | (modal overlay) | implementada |
| 9 | Prescription Detail | /prescriptions/:id | implementada |
| 10 | Employee List | /employees | implementada |
| 11 | Employee Form | (modal overlay) | implementada |
