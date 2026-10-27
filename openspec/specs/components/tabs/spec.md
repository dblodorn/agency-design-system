# components/tabs Specification

## Purpose

Tabs switch between related panels of content in one view, with the tablist keyboard pattern assistive technology expects.

## Requirements

### Requirement: Tabs expose tablist semantics
Tabs SHALL render a `tablist` of `tab` elements, each controlling a `tabpanel`, with exactly one selected tab and its panel visible, in controlled and uncontrolled use.

#### Scenario: Selection reflects in ARIA
- **WHEN** the second tab is selected
- **THEN** it has `aria-selected="true"`, the others have `aria-selected="false"`, and only the second panel is visible and labelled by its tab

### Requirement: Tabs keyboard navigation
Arrow keys SHALL move focus between tabs (Left/Right for horizontal, Up/Down for vertical orientation), Home and End SHALL move to the first and last tab, and disabled tabs SHALL be skipped. Activation SHALL follow focus by default and SHALL support manual activation.

#### Scenario: Automatic activation
- **WHEN** focus is on the first tab and the user presses ArrowRight
- **THEN** focus and selection move to the next enabled tab

#### Scenario: Manual activation
- **WHEN** Tabs use manual activation and the user presses ArrowRight then Enter
- **THEN** selection changes only after Enter

#### Scenario: Focus indicator
- **WHEN** a tab receives keyboard focus
- **THEN** a visible focus ring drawn from the focus tokens is shown
