# components/checkbox Specification

## Purpose

A labelled checkbox for binary and mixed choices that works with forms, keyboard and assistive technology.

## Requirements

### Requirement: Checkbox states
Checkbox SHALL support unchecked, checked and indeterminate states, in both controlled and uncontrolled use, and SHALL expose the state through the `checkbox` role and `aria-checked` (`false`, `true` or `mixed`).

#### Scenario: Toggle with keyboard
- **WHEN** a focused unchecked Checkbox receives Space
- **THEN** it becomes checked and reports `aria-checked="true"`

#### Scenario: Indeterminate
- **WHEN** a Checkbox is rendered with `checked="indeterminate"`
- **THEN** it reports `aria-checked="mixed"` and shows a distinct mixed indicator

#### Scenario: Disabled
- **WHEN** a Checkbox is disabled
- **THEN** it cannot be focused or toggled and reports itself as disabled

### Requirement: Checkbox is labelled and described
Checkbox SHALL require a visible label and SHALL support description and error text with the same associations as Field. Clicking the label SHALL toggle the checkbox.

#### Scenario: Label activates the control
- **WHEN** the user clicks a Checkbox's label
- **THEN** the checkbox toggles

#### Scenario: Error association
- **WHEN** a Checkbox has an error
- **THEN** its accessible description includes the error text and it reports `aria-invalid="true"`

### Requirement: Checkbox participates in forms
A Checkbox with a `name` SHALL submit its `value` (default `on`) when checked and SHALL submit nothing when unchecked.

#### Scenario: Form submission
- **WHEN** a form containing a checked Checkbox named `terms` is submitted
- **THEN** the form data contains `terms=on`
