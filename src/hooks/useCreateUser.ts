import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  avatar: string;
  stepData?: any;
}

const createUser = async (userData: CreateUserData) => {
  const { stepData, ...apiData } = userData;
  const response = await axios.post(
    "https://api.escuelajs.co/api/v1/users/",
    apiData
  );
  return { response: response.data, stepData };
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User created successfully:", data.stepData);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
