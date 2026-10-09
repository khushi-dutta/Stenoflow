const DB_NAME = 'stenoflow-audio';
const STORE_NAME = 'recordings';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('This browser does not support local audio storage.'));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Audio storage could not be opened.'));
  });
}

async function transact<T>(key: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const request = operation(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error(`Could not access audio ${key}.`));
      transaction.onerror = () => reject(transaction.error ?? new Error('Audio storage failed.'));
    });
  } finally { db.close(); }
}

/** The caller stores the returned key in Dictation.audioRef. Audio stays in this browser. */
export async function saveLocalAudio(key: string, file: File): Promise<string> {
  if (!file.type.startsWith('audio/')) throw new Error('Choose an audio file.');
  if (file.size > 100 * 1024 * 1024) throw new Error('Audio must be 100 MB or smaller.');
  await transact(key, 'readwrite', store => store.put(file, key));
  return key;
}

export async function loadLocalAudio(key: string): Promise<Blob | undefined> {
  return transact<Blob | undefined>(key, 'readonly', store => store.get(key));
}

export async function deleteLocalAudio(key: string): Promise<void> {
  await transact(key, 'readwrite', store => store.delete(key));
}
