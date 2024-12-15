export const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('edublog', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
    };
  });
};

export const syncWithServer = async (userId: string | null) => {
  if (!userId) return;

  const db = await initDB();
  // Здесь будет логика синхронизации с сервером
  // Пока оставим как заглушку
};