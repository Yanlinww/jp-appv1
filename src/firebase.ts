// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// ✨ 1. 多引入 enableIndexedDbPersistence
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCF-lLVWyiAKyt1CTR_xUEBeG2wuvlmRdM",
  authDomain: "jp-learning-app-be926.firebaseapp.com",
  projectId: "jp-learning-app-be926",
  storageBucket: "jp-learning-app-be926.firebasestorage.app",
  messagingSenderId: "575054713344",
  appId: "1:575054713344:web:013984b2bb0e40608abee5",
  measurementId: "G-F8WSZ7JJZ2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✨ 2. 啟用離線資料庫支援
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('多個分頁開啟中，離線模式僅能在一個分頁運作');
  } else if (err.code == 'unimplemented') {
    console.log('瀏覽器不支援離線模式');
  }
});

export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("登入失敗:", error);
    alert("登入失敗，請檢查網路或稍後再試");
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    alert("已登出");
    window.location.reload(); 
  } catch (error) {
    console.error("登出失敗", error);
  }
};