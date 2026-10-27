# Spec Delta

## Purpose

Non-modal floating content anchored to a trigger, for supplementary controls or information that should not block the page.

## ADDED Requirements

### Requirement: Popover opens from a trigger and manages focus
Popover SHALL open from its trigger, move focus into its content on open, and return focus to the trigger on close, in controlled and uncontrolled use. The trigger SHALL expose `aria-expanded` and `aria-controls` for the content.

#### Scenario: Open and focus
- **WHEN** the user activates a Popover trigger
- **THEN** the content is shown, the trigger reports `aria-expanded="true"` and focus moves into the content

#### Scenario: Dismiss with Escape
- **WHEN** the Popover is open and the user presses Escape
- **THEN** the content closes and focus returns to the trigger

#### Scenario: Dismiss by outside interaction
- **WHEN** the Popover is open and the user clicks outside it
- **THEN** the content closes

### Requirement: Popover content is themed, elevated and motion-safe
Popover content SHALL follow the portal-theming and floating-elevation requirements, and any entry motion SHALL be removed under reduced motion.

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion and a Popover opens
- **THEN** the content has no entry animation
