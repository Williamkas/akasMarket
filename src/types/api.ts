export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string;
  };
  data: null;
};

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
