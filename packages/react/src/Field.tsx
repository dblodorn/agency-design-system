'use client';
import { createContext, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import styles from './Field.module.css';
export type FieldControlProps = { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true };
type FieldContextValue = { control: FieldControlProps; labelId: string };
const FieldContext = createContext<FieldContextValue | null>(null);
type AssociationOptions = { id?: string; description?: ReactNode; error?: ReactNode; describedBy?: string; invalid?: boolean | 'true' | 'false' | 'grammar' | 'spelling' };
// IDs come from useId so server and client renders agree. Description order: caller IDs, description, error.
export function useFieldAssociations({ id, description, error, describedBy, invalid }: AssociationOptions) {
  const generatedId = useId(); const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const ariaDescribedBy = [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const isInvalid = Boolean(error) || invalid === true || invalid === 'true';
  const control: FieldControlProps = { id: controlId, ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}), ...(isInvalid ? { 'aria-invalid': true as const } : {}) };
  return { control, labelId: `${controlId}-label`, descriptionId, errorId };
}
export function FieldMessages({ description, error, descriptionId, errorId }: { description?: ReactNode; error?: ReactNode; descriptionId?: string; errorId?: string }) {
  return <>
    {description ? <p id={descriptionId} className={styles.description}>{description}</p> : null}
    {error ? <p id={errorId} className={styles.error}>{error}</p> : null}
  </>;
}
// Controls inside a Field read their id and ARIA wiring here. Non-labelable controls also set aria-labelledby={labelId}.
export function useFieldControl() {
  return useContext(FieldContext);
}
export type FieldProps = Omit<ComponentPropsWithoutRef<'div'>, 'id'> & {
  label: ReactNode; description?: ReactNode; error?: ReactNode; id?: string;
  'aria-describedby'?: string; 'aria-invalid'?: AssociationOptions['invalid']; children: ReactNode;
};
export function Field({ label, description, error, id, 'aria-describedby': describedBy, 'aria-invalid': invalid, className, children, ...props }: FieldProps) {
  const { control, labelId, descriptionId, errorId } = useFieldAssociations({ id, description, error, describedBy, invalid });
  return <div {...props} className={[styles.root, className].filter(Boolean).join(' ')}>
    <label id={labelId} className={styles.label} htmlFor={control.id}>{label}</label>
    <FieldContext.Provider value={{ control, labelId }}>{children}</FieldContext.Provider>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}
