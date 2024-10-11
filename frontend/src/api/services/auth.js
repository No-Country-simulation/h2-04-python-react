import { toast } from "sonner";

const BASE_URL = "https://wakibackend.pythonanywhere.com";


export const fetchData = async (endpoint, method, body, token) => {
  try {
    const URL = `${BASE_URL}/${endpoint}`;
    const headers = { "Content-Type": "application/json" };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(URL, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Error en la solicitud");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error: " + error.message);
    return null;
  }
};


export const register = async (data) => {
    const response = await fetchData("user/register/", "POST", {
      full_name: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password2: data.confirmPassword,
    });
  
      return response; 
  };
