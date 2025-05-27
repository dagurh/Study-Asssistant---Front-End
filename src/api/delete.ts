const API_URL = import.meta.env.VITE_API_URL;

export async function deleteItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete item with ID ${id}`);
  }
}