import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toastSuccess, toastError, getErrorMessage } from '../lib/toast';

type MutationParams<TData, TError, TVariable, TContext> = UseMutationOptions<TData, TError, TVariable, TContext>;

export interface UseToastMutationOptions<TData, TError, TVariable>
  extends Omit<MutationParams<TData, TError, TVariable, unknown>, 'onError' | 'onSuccess'> {
  onSuccess?: (data: TData, variables: TVariable) => void;
  onError?: (error: TError, variables: TVariable) => void;
  successMessage?: string;
  errorMessage?: string | ((error: TError) => string);
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useToastMutation<TData = unknown, TError = unknown, TVariable = unknown>(
  options: UseToastMutationOptions<TData, TError, TVariable>
) {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    ...mutationOptions
  } = options;

  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariable>({
    ...mutationOptions,
    onSuccess: (data, variables) => {
      if (showSuccessToast && successMessage) {
        toastSuccess(successMessage);
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      if (showErrorToast) {
        const message = typeof errorMessage === 'function' 
          ? errorMessage(error) 
          : errorMessage || getErrorMessage(error);
        toastError(message);
      }
      onError?.(error, variables);
    },
  });
}
