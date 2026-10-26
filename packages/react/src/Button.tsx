import type { ComponentPropsWithRef } from 'react';
import styles from './Button.module.css';
export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'quiet'; size?: 'small' | 'medium';
};
export function Button({ variant = 'primary', size = 'medium', type = 'button', className, ...props }: ButtonProps) {
  return <button {...props} type={type} data-variant={variant} data-size={size} className={[styles.root, className].filter(Boolean).join(' ')} />;
}
