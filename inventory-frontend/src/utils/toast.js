import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: '12px',
      background: '#10b981',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '12px 20px',
      maxWidth: '90vw',
      textAlign: 'center',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    style: {
      borderRadius: '12px',
      background: '#ef4444',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '12px 20px',
      maxWidth: '90vw',
      textAlign: 'center',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      borderRadius: '10px',
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
