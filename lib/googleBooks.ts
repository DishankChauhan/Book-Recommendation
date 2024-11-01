const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function searchBooks(query: string) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
  );
  const data = await response.json();
  return data.items;
}

export async function getBookDetails(bookId: string) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
  );
  return await response.json();
}