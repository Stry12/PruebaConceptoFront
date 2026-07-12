# Component Plan - Hospital Management System

## Cross-Screen Pattern Inventory

### Patterns identified and unified:

1. **Avatar (initials + rotating color)**
   - Used in: OPD Queue (Receptionist), OPD Queue (Doctor), Patient Search, Patient Detail, Employee List
   - Component: `shared/components/ui/Avatar.tsx`
   - Variants: sm (9x9), md (10x10), lg (14x14)
   - Color rotation: 6 colors based on entity ID modulo

2. **Status Badge (colored pill)**
   - Used in: OPD Queue (status: En espera, En atencion, Atendido), Patient Detail (visit status), Employee List (role badges)
   - Component: `shared/components/ui/Badge.tsx`
   - Variants: primary, secondary, accent, success, error, neutral

3. **Primary Button (teal)**
   - Used in: All screens with actions
   - Component: `shared/components/ui/Button.tsx`
   - Variants: primary, secondary, danger, ghost

4. **Modal overlay**
   - Used in: Employee Form, Add to Queue, Create Prescription, Confirm Delete
   - Component: `shared/components/ui/Modal.tsx`
   - Pattern: backdrop with centered card, header with title + close, body, footer with actions

5. **Confirmation Dialog**
   - Used in: Delete employee, Remove from queue, Discharge patient
   - Component: `shared/components/ui/ConfirmDialog.tsx`
   - Pattern: Modal with message + cancel/confirm buttons

6. **Search Input**
   - Used in: Patient Search, Employee List
   - Component: `shared/components/ui/SearchInput.tsx`
   - Pattern: Full-width input with search icon, focus ring

7. **Table**
   - Used in: OPD Queue (Receptionist), Patient Detail (visit history), Employee List
   - Not extracted as separate component - each screen builds its own table markup but uses consistent classes from Tailwind

8. **Empty State**
   - Used in: Patient Search (no results), OPD Visit Detail (no prescriptions)
   - Component: `shared/components/ui/EmptyState.tsx`
   - Pattern: Centered icon + message + optional action

9. **Sidebar Navigation**
   - Used in: All authenticated screens
   - Component: `shared/components/layout/Sidebar.tsx`
   - Role-filtered nav items

10. **Header with user info**
    - Used in: All authenticated screens
    - Component: `shared/components/layout/Header.tsx`
    - Pattern: Name + role + avatar
