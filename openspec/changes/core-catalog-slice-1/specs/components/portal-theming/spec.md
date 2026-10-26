# Spec Delta

## Purpose

Content rendered into a portal leaves its Theme subtree in the DOM; this capability guarantees it still resolves tokens in the trigger tree's light or dark mode.

## ADDED Requirements

### Requirement: Portaled content inherits the scoped theme
Every component that renders into a portal (Dialog content and overlay, Popover content, Select content, DropdownMenu content) SHALL carry the explicit theme mode of the nearest enclosing Theme.

#### Scenario: Dark theme survives the portal
- **WHEN** a Popover, Select or DropdownMenu opens from a trigger inside `<Theme mode="dark">`
- **THEN** its portaled content element has `data-agency-theme="dark"` and resolves semantic colours to their dark values

#### Scenario: Dialog overlay is themed
- **WHEN** a Dialog opens inside `<Theme mode="dark">`
- **THEN** both the overlay and the content carry `data-agency-theme="dark"`

#### Scenario: Default without a Theme
- **WHEN** a portaled component renders with no enclosing Theme
- **THEN** its content carries `data-agency-theme="light"`

### Requirement: Theme context remains importable from its existing location
The existing `ThemeContext` export SHALL remain available to code that imported it before this change.

#### Scenario: Existing import keeps working
- **WHEN** source that imports `ThemeContext` from the Dialog module is compiled
- **THEN** it compiles and receives the same context object the Theme provider supplies
