# Objective authoring and help page plan

## Goal

Enable managers to create objectives, manage scoring presets, and use a dedicated help page that explains what objectives are, what each field means, and how to create them with concrete examples.

## Current state

- Objective authoring already exists in:
  - `src/routes/admin/events/$eventId/objectives.$objectiveId.tsx`
  - `src/components/form-dialogs/ObjectiveFormModal.tsx`
  - `src/components/form-dialogs/CategoryFormModal.tsx`
- Scoring rule authoring already exists in:
  - `src/routes/admin/events/$eventId/scoring-rules.tsx`
- The forms mostly show raw backend field names and enum values with minimal guidance.
- `objective-frontend-display-reference.md` already contains the desired labels, explanations, and authoring copy for objectives.

## Implementation approach

### 1. Split access by capability

- Adjust route guards and entry points so managers can reach:
  - objective authoring
  - scoring rule authoring
  - the help page

### 2. Add an objective help/reference page

- Create a dedicated route in the admin event authoring area for objective help.
- Make it available to admins, objective designers, and managers.
- Add visible entry points from the objective authoring screen and optionally from scoring rule authoring.

### 3. Turn the reference doc into in-product guidance

- Use `objective-frontend-display-reference.md` as the source for:
  - what an objective is
  - what each field means
  - explanations for the enum values that the fields can take
  - objective type descriptions
  - counting method explanations
  - scoring rule explanations
  - advanced fields and when they matter
- Present the content in a readable UI format using existing app patterns such as cards, prose sections, and tables.

### 4. Improve the create-objective form for new managers

- Replace labels with the recommended UI wording where safe.
- Add inline helper text or contextual guidance for the fields that are hardest to understand:
  - objective type
  - tracked value
  - tracked value explanation
  - counting method
  - scoring rules
  - required number
  - valid from / valid to
  - hide progress
  - extra
- Keep type-specific or advanced inputs conditional so the form stays approachable.

### 5. Add example-based onboarding

- Include several worked examples on the help page, for example:
  - a simple item objective
  - a player progression objective
  - a submission objective
  - a category/child-objective setup
- Show the exact fields each example uses so managers can copy the pattern.

### 6. Validate the full authoring flow

- Confirm manager-visible navigation is clear.
- Confirm the help page is reachable from the places where managers need it.
- Confirm managers can create objectives and manage scoring rules without exposing unrelated admin controls.

## Likely files to touch

- `src/routes/admin/index.tsx`
- `src/routes/admin/events/index.tsx`
- `src/routes/admin/events/$eventId/objectives.$objectiveId.tsx`
- `src/routes/admin/events/$eventId/scoring-rules.tsx`
- new help route under `src/routes/admin/events/$eventId/`
- `src/components/form-dialogs/ObjectiveFormModal.tsx`
- `src/components/form-dialogs/CategoryFormModal.tsx`
- possibly shared form field components if helper text needs shared support

## Notes

- The current shared form field components do not appear to support helper text directly, so implementation may require either:
  - extending shared form components, or
  - composing explanatory UI around the current fields
- `useGetValidConditionMappings` already exposes tracked values by objective type and should be reused instead of duplicating backend logic.
- The help page should stay practical for new managers, with examples and plain-language explanations rather than backend terminology alone.
