// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 你的 Firebase 設定 (已填入你提供的資訊)
const firebaseConfig = {
  apiKey: "AIzaSyCF-lLVWyiAKyt1CTR_xUEBeG2wuvlmRdM",
  authDomain: "jp-learning-app-be926.firebaseapp.com",
  projectId: "jp-learning-app-be926",
  storageBucket: "jp-learning-app-be926.firebasestorage.app",
  messagingSenderId: "575054713344",
  appId: "1:575054713344:web:013984b2bb0e40608abee5",
  measurementId: "G-F8WSZ7JJZ2"
};

// 1. 初始化 Firebase (只做一次)
const app = initializeApp(firebaseConfig);

// 2. 匯出功能給 App.tsx 使用
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 3. 登入函式
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("登入失敗:", error);
    alert("登入失敗，請檢查網路或稍後再試");
  }
};

// 4. 登出函式
export const logout = async () => {
  try {
    await signOut(auth);
    alert("已登出");
    window.location.reload(); // 重新整理以清除狀態
  } catch (error) {
    console.error("登出失敗", error);
  }
};