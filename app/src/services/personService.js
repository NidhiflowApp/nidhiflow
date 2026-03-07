export const getPersons = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/persons");
    if (!response.ok) {
      throw new Error("Failed to fetch persons");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};