import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
}from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQyhPHAKhYsdKLzslW3WnRkYtTrpknb0I",
    authDomain: "crown-clothing-db-76aaa.firebaseapp.com",
    projectId: "crown-clothing-db-76aaa",
    storageBucket: "crown-clothing-db-76aaa.appspot.com",
    messagingSenderId: "333529775478",
    appId: "1:333529775478:web:aa0b9e4bf17e6810548e57"
  };
  

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWIthGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid);

    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot);
    console.log(userSnapshot.exists());

    if(!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt
            });
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
}