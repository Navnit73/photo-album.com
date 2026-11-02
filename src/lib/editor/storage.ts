import type { Album, Photo } from "./types";

/**
 * Local-only persistence (IndexedDB) used until accounts + cloud storage exist (Phase 4).
 * Everything stays in the user's browser.
 */
const DB = "photo-albums-editor";
let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore("albums", { keyPath: "id" });
      db.createObjectStore("photos", { keyPath: "id" }).createIndex("albumId", "albumId");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then((db) => new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction(store, mode).objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

export const saveAlbum = (a: Album) => run("albums", "readwrite", (s) => s.put(a));
export const loadAlbum = (id: string) => run<Album | undefined>("albums", "readonly", (s) => s.get(id));
export const listAlbums = () => run<Album[]>("albums", "readonly", (s) => s.getAll());
export const savePhoto = (p: Photo) => run("photos", "readwrite", (s) => s.put(p));
export const deletePhoto = (id: string) => run("photos", "readwrite", (s) => s.delete(id));
export const loadPhotos = (albumId: string) =>
  run<Photo[]>("photos", "readonly", (s) => s.index("albumId").getAll(albumId));

export async function deleteAlbum(id: string) {
  const photos = await loadPhotos(id);
  await Promise.all(photos.map((p) => deletePhoto(p.id)));
  await run("albums", "readwrite", (s) => s.delete(id));
}
