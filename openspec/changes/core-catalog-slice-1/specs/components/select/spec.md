# Spec Delta

## Purpose

A labelled single-value select with a styled listbox, keyboard support and form participation, for choosing one option from a short known list.

## ADDED Requirements

### Requirement: Select chooses one value
Select SHALL let the user choose exactly one option from a list, in controlled and uncontrolled use, show a placeholder when no value is chosen, and support disabled options and option groups with labels.

#### Scenario: Choose with keyboard
- **WHEN** a focused Select trigger receives Enter or Space, the user presses ArrowDown and then Enter
- **THEN** the listbox opens, the next enabled option is selected and the trigger shows its label

#### Scenario: Disabled option
- **WHEN** an option is disabled
- **THEN** keyboard navigation skips it and it cannot be selected

#### Scenario: Escape closes without change
- **WHEN** the listbox is open and the user presses Escape
- **THEN** the listbox closes, the value is unchanged and focus returns to the trigger

### Requirement: Select is labelled and described
Select SHALL require a visible label and SHALL support description and error text with the same associations as Field.

#### Scenario: Accessible name and description
- **WHEN** a Select renders with label "Currency", a description and an error
- **THEN** the trigger's accessible name is "Currency", its accessible description contains the description and error text, and it reports invalid

### Requirement: Select participates in forms
A Select with a `name` SHALL submit its current value with the form.

#### Scenario: Form submission
- **WHEN** a form containing a Select named `currency` with value `EUR` is submitted
- **THEN** the form data contains `currency=EUR`

### Requirement: Select content is themed and elevated
The open listbox SHALL follow the portal-theming and floating-elevation requirements.

#### Scenario: Dark listbox
- **WHEN** a Select inside a dark Theme opens
- **THEN** the listbox carries `data-agency-theme="dark"`
