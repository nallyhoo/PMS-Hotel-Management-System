import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme = 'light', ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1a1a1a] group-[.toaster]:border-[#1a1a1a]/10 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[#1a1a1a]/60',
          actionButton: 'group-[.toast]:bg-[#1a1a1a] group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-[#1a1a1a]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
