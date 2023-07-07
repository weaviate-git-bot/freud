import { baseStyles } from './baseStyles';
import { cssResetStyles } from './cssReset';
import { printStyles } from './printStyles';
import { reachStyles } from './reachStyles';
import { tiptapStyles } from './tiptapStyles';
import { toastifyStyles } from './toastifyStyles';

export const globalStyles = () => {
  cssResetStyles();
  baseStyles();
  printStyles();
  reachStyles();
  tiptapStyles();
  toastifyStyles();
};
