import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
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
