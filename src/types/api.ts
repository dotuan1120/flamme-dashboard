interface RequestResponseType<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export default RequestResponseType;