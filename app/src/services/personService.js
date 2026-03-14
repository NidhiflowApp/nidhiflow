import apiClient from "./apiClient";

export const getPersons = async () => {
  try {
    const res = await apiClient.get("/persons");
    return res.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};