# Spec Delta

## Purpose

An action menu opened from a button, for commands that act on the current context; not for navigation or choosing a form value.

## ADDED Requirements

### Requirement: DropdownMenu exposes menu semantics
DropdownMenu SHALL render its trigger as a button with `aria-haspopup="menu"` and `aria-expanded`, and its content as a `menu` of `menuitem` elements, with optional group labels and separators.

#### Scenario: Open from the keyboard
- **WHEN** the focused trigger receives Enter, Space or ArrowDown
- **THEN** the menu opens and focus moves to the first enabled item

### Requirement: DropdownMenu keyboard navigation and selection
Arrow keys SHALL move between enabled items, Home and End SHALL move to the first and last item, typing a character SHALL move to the next matching item, disabled items SHALL be skipped and not selectable, and selecting an item SHALL run its action, close the menu and return focus to the trigger.

#### Scenario: Select an item
- **WHEN** focus is on an enabled item and the user presses Enter
- **THEN** the item's select handler runs once, the menu closes and focus returns to the trigger

#### Scenario: Disabled item
- **WHEN** an item is disabled
- **THEN** it reports `aria-disabled="true"`, keyboard navigation skips it and activating it does nothing

#### Scenario: Escape
- **WHEN** the menu is open and the user presses Escape
- **THEN** the menu closes without running any action and focus returns to the trigger

### Requirement: Destructive items are distinguishable
A menu item marked as destructive SHALL be styled with the danger status colour while keeping the same semantics.

#### Scenario: Destructive styling
- **WHEN** an item is marked destructive
- **THEN** its text colour is the resolved `color.status.danger` value for the active mode

### Requirement: DropdownMenu content is themed and elevated
Menu content SHALL follow the portal-theming and floating-elevation requirements.

#### Scenario: Dark menu
- **WHEN** a DropdownMenu inside a dark Theme opens
- **THEN** the menu carries `data-agency-theme="dark"`
