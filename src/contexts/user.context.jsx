import { createContext, useEffect, useReducer } from "react";

import { createAction } from "../utils/reducer/reducer.utils";

import { onAuthStateChangedListener, 
	createUserDocumentFromAuth 
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
});

export const USER_ACTION_TYPES = {
	SET_CURRENT_USER: 'SET_CURRENT_USER'
}

const userReducer = (state, action) => {
	console.log('dispatched');
	console.log(action);
	const { type, payload } = action;

	switch(type) {
		case USER_ACTION_TYPES.SET_CURRENT_USER:
			return {
				...state,
				currentUser: payload
			}
		default:
			throw new Error(`Unhandled type ${type} in userReducer`);
	}
}

const INITAL_STATE = {
	currentUser: null
}


export const UserProvider = ({ children }) => {
	const [ { currentUser } , dispatch ] = useReducer(userReducer, INITAL_STATE);
	console.log(currentUser);
	
	const setCurrentUser = (user) => {
		dispatch( createAction(USER_ACTION_TYPES.SET_CURRENT_USER,user));
	}

	const value = { currentUser, setCurrentUser };

	useEffect(() => {
		const unsubscsribe = onAuthStateChangedListener((user) => {
			if(user) {
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
		})

		return unsubscsribe;
	}, []);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}