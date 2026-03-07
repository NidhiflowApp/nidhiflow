import apiClient from "./apiClient";

// ====================
// REGISTER
// ====================
const register = async (name, email, password, whatsappNumber) => {
 const response = await apiClient.post("/auth/register", {
  name,
  email,
  password,
  whatsappNumber,
});

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const getToken = () => {
  return localStorage.getItem("token");
};

const authService = {
  register,
  login,
  logout,
  getToken,
};

export default authService;
