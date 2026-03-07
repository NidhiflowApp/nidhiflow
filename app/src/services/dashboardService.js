import apiClient from "./apiClient";

export const getDashboardData = async (year, month) => {
  const res = await apiClient.get(
    `/dashboard?year=${year}&month=${month}`
  );

  return res.data;
};