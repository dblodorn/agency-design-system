# components/field Specification

## Purpose

One composition for labelling, describing and reporting errors on any form control, so every control gets the same accessible name and description wiring.

## Requirements

### Requirement: Field associates label, description and error with its control
A Field SHALL render a visible label tied to its control, and SHALL expose optional description and error text through the control's accessible description in the order external IDs, description, error.

#### Scenario: Full association
- **WHEN** a Field renders with a label, description, error and a caller-supplied `aria-describedby`
- **THEN** the control's accessible name is the label, its `aria-describedby` lists the caller ID, then the description ID, then the error ID, and it has `aria-invalid="true"`

#### Scenario: Optional parts omitted
- **WHEN** a Field renders with only a label
- **THEN** no description or error element is rendered and the control has no `aria-describedby` and no `aria-invalid`

#### Scenario: Caller-supplied ID
- **WHEN** the caller passes an `id`
- **THEN** the control uses that ID and the label references it; otherwise a stable generated ID is used that matches between server and client render

### Requirement: Field works with native and non-native controls
Field SHALL label native inputs through `for`/`id` and SHALL label controls that are not labelable elements (such as a button-based select trigger or a checkbox) through `aria-labelledby`.

#### Scenario: Button-based control
- **WHEN** a Select trigger is placed in a Field
- **THEN** the trigger's accessible name includes the Field label

### Requirement: TextField keeps its contract
TextField SHALL keep its existing props, rendered associations and class entry point while being composed from Field.

#### Scenario: Existing TextField markup contract
- **WHEN** TextField renders with `id="project"`, a label, description, error and `aria-describedby="external"`
- **THEN** the label has `for="project"` and the input has `aria-describedby="external project-description project-error"` and `aria-invalid="true"`
