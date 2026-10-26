import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import styles from './TextField.module.css';
export type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> & {
  label: string; description?: ReactNode; error?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
};
export function TextField({ label, description, error, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: TextFieldProps) {
  const generatedId = useId(); const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptions = [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>
    <label className={styles.label} htmlFor={inputId}>{label}</label>
    <input {...props} id={inputId} aria-describedby={descriptions} aria-invalid={error ? true : invalid} className={styles.input} />
    {description ? <p id={descriptionId} className={styles.description}>{description}</p> : null}
    {error ? <p id={errorId} className={styles.error}>{error}</p> : null}
  </div>;
}
