'use client';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Field, useFieldControl } from './Field';
import styles from './TextField.module.css';
export type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> & {
  label: string; description?: ReactNode; error?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
};
function TextFieldInput(props: ComponentPropsWithRef<'input'>) {
  const field = useFieldControl();
  return <input {...props} {...field?.control} className={styles.input} />;
}
export function TextField({ label, description, error, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: TextFieldProps) {
  return <Field label={label} description={description} error={error} id={id} aria-describedby={describedBy} aria-invalid={invalid} className={className}>
    <TextFieldInput {...props} />
  </Field>;
}
