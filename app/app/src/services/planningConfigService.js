import apiClient from "./apiClient";

// GET planning config
export const getPlanningConfig = async () => {
  const response = await apiClient.get("/planning-config");
  return response.data;
};

// SAVE / UPDATE planning config
export const savePlanningConfig = async (config) => {
  const response = await apiClient.post("/planning-config", config);
  return response.data;
};