# tokens/foundations Specification

## Purpose

Semantic foundation tokens for type weight, focus ring geometry, overlay scrim and elevation, so component styling never depends on raw values that a theme or brand pass cannot reach.

## Requirements

### Requirement: Font weight tokens
The token catalog SHALL expose public font weight tokens for the regular, medium and strong roles, with values inside the 400–700 range covered by the interface font.

#### Scenario: Weight tokens resolve in every mode
- **WHEN** the token build runs
- **THEN** `font.weight.regular`, `font.weight.medium` and `font.weight.strong` resolve to numbers in light and dark modes and are emitted as `--agency-font-weight-*` custom properties

#### Scenario: Button uses the strong weight token
- **WHEN** a Button renders
- **THEN** its computed font weight equals the resolved value of `font.weight.strong`

### Requirement: Focus ring tokens
The token catalog SHALL expose public tokens for focus ring width and offset, and every focusable component SHALL draw its focus indicator from those tokens and `color.focus.ring`.

#### Scenario: Focus ring geometry comes from tokens
- **WHEN** a Button, TextField input, Checkbox, Select trigger, Tab or Dialog content receives keyboard focus
- **THEN** its outline width and outline offset equal the resolved `focus.ring.width` and `focus.ring.offset` values

### Requirement: Overlay scrim token
The token catalog SHALL expose a public scrim colour token with a value for every mode, and modal overlays SHALL use it.

#### Scenario: Scrim follows the active mode
- **WHEN** a Dialog opens inside a dark Theme
- **THEN** the overlay background equals the dark-mode value of `color.overlay.scrim`

### Requirement: Elevation token for floating surfaces
The token catalog SHALL expose a public elevation token for floating surfaces, used by Dialog, Popover, Select and DropdownMenu content.

#### Scenario: Floating content uses the elevation token
- **WHEN** Dialog, Popover, Select or DropdownMenu content is shown
- **THEN** its box shadow is the resolved value of the floating elevation token

### Requirement: No raw values for tokenized roles
Component CSS SHALL NOT contain literal values for font weight, focus outline width or offset, scrim colour or floating shadow.

#### Scenario: Raw value check
- **WHEN** the component CSS sources are scanned
- **THEN** no `font-weight`, `outline`, `outline-offset`, `box-shadow` or overlay `background` declaration uses a literal value instead of an `--agency-*` custom property
