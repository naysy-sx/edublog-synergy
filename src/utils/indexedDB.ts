import { supabase } from "@/integrations/supabase/client";

const DB_NAME = 'edublog';
const DB_VERSION = 1;

export const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('posts')) {
        const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
        postsStore.createIndex('categoryId', 'category_id');
        postsStore.createIndex('authorId', 'author_id');
      }
      
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addToSyncQueue = async (operation: string, data: any) => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  
  await store.add({
    operation,
    data,
    timestamp: new Date().toISOString()
  });

  if ('serviceWorker' in navigator && 'sync' in registration) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-posts');
  } else {
    // Fallback for browsers that don't support background sync
    await syncWithServer();
  }
};

export const syncWithServer = async () => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction(['posts', 'syncQueue'], 'readwrite');
  const syncStore = tx.objectStore('syncQueue');
  const postsStore = tx.objectStore('posts');

  const pendingChanges = await syncStore.getAll();

  for (const change of pendingChanges) {
    try {
      switch (change.operation) {
        case 'CREATE':
          await supabase.from('posts').insert(change.data);
          break;
        case 'UPDATE':
          await supabase.from('posts').update(change.data).eq('id', change.data.id);
          break;
        case 'DELETE':
          await supabase.from('posts').delete().eq('id', change.data.id);
          break;
      }
      
      // Remove from sync queue after successful sync
      await syncStore.delete(change.id);
    } catch (error) {
      console.error('Sync failed for change:', change, error);
    }
  }
};

// CRUD operations for posts
export const createPost = async (post: any) => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction('posts', 'readwrite');
  const store = tx.objectStore('posts');
  
  await store.add(post);
  await addToSyncQueue('CREATE', post);
};

export const updatePost = async (post: any) => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction('posts', 'readwrite');
  const store = tx.objectStore('posts');
  
  await store.put(post);
  await addToSyncQueue('UPDATE', post);
};

export const deletePost = async (postId: string) => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction('posts', 'readwrite');
  const store = tx.objectStore('posts');
  
  await store.delete(postId);
  await addToSyncQueue('DELETE', { id: postId });
};

export const getAllPosts = async () => {
  const db = await initDB();
  const tx = (db as IDBDatabase).transaction('posts', 'readonly');
  const store = tx.objectStore('posts');
  
  return store.getAll();
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful');
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};