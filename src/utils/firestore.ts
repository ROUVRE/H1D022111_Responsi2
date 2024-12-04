import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// interface data
export interface Menu {
  id?: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// operasi CRUD
export const firestoreService = {
  // get collection ref
  getMenuRef() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    return collection(db, "users", uid, "menus");
  },

  // create
  async addMenu(menu: Omit<Menu, "id">) {
    try {
      const menuRef = this.getMenuRef();
      const docRef = await addDoc(menuRef, {
        ...menu,
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error Tambah Menu:", error);
      throw error;
    }
  },

  // read
  async getMenus(): Promise<Menu[]> {
    try {
      const menuRef = this.getMenuRef();
      const q = query(menuRef, orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Menu)
      );
    } catch (error) {
      console.error("Error Get Menus:", error);
      throw error;
    }
  },

  // update
  async updateMenu(id: string, menu: Partial<Menu>) {
    try {
      const menuRef = this.getMenuRef();
      const docRef = doc(menuRef, id);
      await updateDoc(docRef, {
        ...menu,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error Update Menu:", error);
      throw error;
    }
  },

  // delete
  async deleteMenu(id: string) {
    try {
      const menuRef = this.getMenuRef();
      const docRef = doc(menuRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error Delete Menu:", error);
      throw error;
    }
  },

  // update status
  async updateStatus(id: string, status: boolean) {
    try {
      const menuRef = this.getMenuRef();
      const docRef = doc(menuRef, id);
      await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
    } catch (error) {
      console.error("Error Update Status:", error);
      throw error;
    }
  },
};
