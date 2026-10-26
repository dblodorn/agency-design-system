'use client';
import * as Primitive from '@radix-ui/react-checkbox';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { FieldMessages, useFieldAssociations } from './Field';
import styles from './Checkbox.module.css';
export type CheckboxProps = Omit<ComponentPropsWithRef<typeof Primitive.Root>, 'children' | 'asChild'> & {
  label: ReactNode; description?: ReactNode; error?: ReactNode;
};
export function Checkbox({ label, description, error, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: CheckboxProps) {
  const { control, labelId, descriptionId, errorId } = useFieldAssociations({ id, description, error, describedBy, invalid });
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>
    <div className={styles.row}>
      <Primitive.Root {...props} {...control} aria-labelledby={labelId} className={styles.box}>
        <Primitive.Indicator className={styles.indicator}>
          <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
          <svg className={styles.mixed} viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8" /></svg>
        </Primitive.Indicator>
      </Primitive.Root>
      <label id={labelId} htmlFor={control.id} className={styles.label}>{label}</label>
    </div>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}
