import { toast } from 'sonner';

const defaultOptions = {
  duration: 4000,
  dismissible: true,
};

export const toastSuccess = (message: string, options?: object) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const toastError = (message: string, options?: object) => {
  toast.error(message, { 
    ...defaultOptions, 
    duration: 5000,
    ...options,
  });
};

export const toastInfo = (message: string, options?: object) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const toastWarning = (message: string, options?: object) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Error occurred',
    ...defaultOptions,
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
};
