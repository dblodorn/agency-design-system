'use client';
import * as Primitive from '@radix-ui/react-select';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Field, useFieldControl } from './Field';
import { usePortalTheme } from './ThemeContext';
import styles from './Select.module.css';
export type SelectProps = ComponentPropsWithRef<typeof Primitive.Root> & {
  label: ReactNode; description?: ReactNode; error?: ReactNode; placeholder?: ReactNode;
  id?: string; className?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean;
};
function SelectTrigger({ placeholder }: { placeholder?: ReactNode }) {
  const field = useFieldControl();
  return <Primitive.Trigger {...field?.control} aria-labelledby={field?.labelId} className={styles.trigger}>
    <Primitive.Value placeholder={placeholder} />
    <Primitive.Icon className={styles.icon}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg></Primitive.Icon>
  </Primitive.Trigger>;
}
export function Select({ label, description, error, placeholder, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, children, ...props }: SelectProps) {
  const theme = usePortalTheme();
  return <Field label={label} description={description} error={error} id={id} aria-describedby={describedBy} aria-invalid={invalid} className={className}>
    <Primitive.Root {...props}>
      <SelectTrigger placeholder={placeholder} />
      <Primitive.Portal>
        <Primitive.Content {...theme} position="popper" sideOffset={4} collisionPadding={8} className={styles.content}>
          <Primitive.Viewport className={styles.viewport}>{children}</Primitive.Viewport>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  </Field>;
}
export type SelectItemProps = Omit<ComponentPropsWithRef<typeof Primitive.Item>, 'asChild'>;
export function SelectItem({ children, className, ...props }: SelectItemProps) {
  return <Primitive.Item {...props} className={[styles.item, className].filter(Boolean).join(' ')}>
    <Primitive.ItemText>{children}</Primitive.ItemText>
    <Primitive.ItemIndicator className={styles.itemIndicator}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg></Primitive.ItemIndicator>
  </Primitive.Item>;
}
export function SelectGroup({ label, children, ...props }: Omit<ComponentPropsWithRef<typeof Primitive.Group>, 'asChild'> & { label: ReactNode }) {
  return <Primitive.Group {...props}><Primitive.Label className={styles.groupLabel}>{label}</Primitive.Label>{children}</Primitive.Group>;
}
export function SelectSeparator() {
  return <Primitive.Separator className={styles.separator} />;
}
