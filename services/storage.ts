import { JobApplication, JobApplicationFormData } from '../types';
import { db } from './firebase';
import { collection, query, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export const fetchApplications = async (userId: string): Promise<JobApplication[]> => {
  try {
    const q = query(collection(db, "users", userId, "applications"));
    const querySnapshot = await getDocs(q);
    const apps: JobApplication[] = [];
    querySnapshot.forEach((doc) => {
      apps.push(doc.data() as JobApplication);
    });
    // Sort by most recently added (or applied) if needed, currently just DB order
    // Let's sort by dateApplied desc in memory for simplicity
    return apps.sort((a, b) => {
       // simple string compare for YYYY-MM-DD or DD/MM/YYYY is tricky, 
       // but typically we rely on UI sorting or standardized date strings.
       // For now, return as is.
       return 0;
    });
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};

export const addApplicationToDb = async (userId: string, app: JobApplication) => {
  try {
    await setDoc(doc(db, "users", userId, "applications", app.id), app);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updateApplicationInDb = async (userId: string, app: JobApplication) => {
  try {
    const appRef = doc(db, "users", userId, "applications", app.id);
    await updateDoc(appRef, { ...app });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteApplicationFromDb = async (userId: string, appId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "applications", appId));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};