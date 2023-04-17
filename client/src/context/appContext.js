import React, { useReducer, useContext } from "react";
import axios from 'axios';
import reducer from "./reducer";
import {
    DISPLAY_ALERT,
    HIDE_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_TASK_BEGIN,
    CREATE_TASK_SUCCESS,
    CREATE_TASK_ERROR,
    GET_TASKS_BEGIN,
    GET_TASKS_SUCCESS,
    SET_EDIT_TASK,
    DELETE_TASK_BEGIN,
    EDIT_TASK_BEGIN,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE
} from "./actions";
import dayjs from 'dayjs'

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location'); 

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user?JSON.parse(user):null,
    token: token,
    userLocation: userLocation || '',
    showSidebar: false,

    isEditing: false,
    editTaskId: '',
    taskItem: '',
    description: '',
    completeBy: dayjs(Date.now()).format('YYYY-MM-DD'),
    status: 'to do',
    statusOptions: ['to do', 'in progress', 'complete', 'blocked'],
    taskType: 'chore',
    taskTypeOptions: ['chore', 'shopping list', 'work', 'assignment'],
    taskLocation: userLocation || '',
    tasks: [],
    totalTasks: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyTasks: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'due date',
    sortOptions: ['due date', 'a-z', 'z-a'],
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // axios constants
    const authFetch = axios.create({
        baseURL: '/api/v1',
    });

    // request interceptor
    authFetch.interceptors.request.use(
        (config) => {
            config.headers['Authorization'] = `Bearer ${state.token}`
            return config;
        }, 
        (error) => {
            return Promise.reject(error);
        }
    );

    // response interceptor
    authFetch.interceptors.response.use(
        (response) => {
            return response;
        }, 
        (error) => {
            if (error.response.status === 401) {
                logoutUser();
            }
            return Promise.reject(error);
        }
    );

    const displayAlert = () => {
        dispatch({type: DISPLAY_ALERT});
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({type: HIDE_ALERT})
        }, 3000);
    }

    const addUserToLocalStorage = ({user, token, location}) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('location', location);
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('location');
    }

    const registerUser = async (currentUser) => {
        dispatch({type: REGISTER_USER_BEGIN});
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser);
            const {user, token, location} = response.data;
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert();
    }

    const loginUser = async (currentUser) => {
        dispatch({type: LOGIN_USER_BEGIN});
        try {
            const response = await axios.post('/api/v1/auth/login', currentUser);
            const {user, token, location} = response.data;
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert();
    }

    const toggleSidebar = () => {
        dispatch({type: TOGGLE_SIDEBAR});
    }

    const logoutUser = () => {
        dispatch({type: LOGOUT_USER});
        removeUserFromLocalStorage();
    }

    const updateUser = async (currentUser) => {
        dispatch({type: UPDATE_USER_BEGIN})
        try {
            const {data} = await authFetch.patch('/auth/updateUser', currentUser);
            const {user, location, token} = data;
            dispatch({type: UPDATE_USER_SUCCESS, payload: {user, location, token}});
            addUserToLocalStorage({user, location, token});
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({type: UPDATE_USER_ERROR, payload: {msg: error.response.data.msg}})
            }
        }
        clearAlert()
    }

    const handleChange = ({name, value}) => {
        dispatch({type: HANDLE_CHANGE, payload: {name, value}});
    }

    const clearValues = () => {
        dispatch({type: CLEAR_VALUES});
    }

    const createTask = async () => {
        dispatch({type: CREATE_TASK_BEGIN})
        try {
            const {taskItem, taskLocation, description, taskType, status, completeBy} = state;
            await authFetch.post('/tasks', {
                taskItem, taskLocation, description, taskType, status, completeBy
            })
            dispatch({type: CREATE_TASK_SUCCESS})
            dispatch({type: CLEAR_VALUES})
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: CREATE_TASK_ERROR, 
                payload: {msg: error.response.data.msg},
            })
        }
        clearAlert()
    }

    const getTasks = async () => {
        const {search, searchStatus, searchType, sort, page} = state;
        let url = `/tasks?status=${searchStatus}&taskType=${searchType}&sort=${sort}&page=${page}`
        if (search) {
            url = url + `&search=${search}`
        }
        dispatch({type: GET_TASKS_BEGIN})
        try {
            const {data} = await authFetch(url);
            const {tasks, totalTasks, numOfPages} = data;
            dispatch({
                type: GET_TASKS_SUCCESS,
                payload: {tasks, totalTasks, numOfPages},
            })
        } catch (error) {
            logoutUser();
        }
        clearAlert();
    }

    const setEditTask = (id) => {
        dispatch({type: SET_EDIT_TASK, payload: {id}});
    }

    const editTask = async () => {
        dispatch({type: EDIT_TASK_BEGIN});
        try {
            const {taskItem, completeBy, taskType, taskLocation, status, description} = state;
            await authFetch.patch(`/tasks/${state.editTaskId}`, {
                taskItem, 
                completeBy, 
                taskLocation, 
                taskType,
                status, 
                description
            });
            dispatch({type: EDIT_TASK_SUCCESS})
            dispatch({type: CLEAR_VALUES})
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: EDIT_TASK_ERROR, 
                payload: {msg: error.response.data.msg}
            })
        }
        clearAlert();
    }

    const deleteTask = async (id) => {
        dispatch({type: DELETE_TASK_BEGIN});
        try {
            await authFetch.delete(`/tasks/${id}`);
            getTasks();
        } catch (error) {
            logoutUser();
        }
    }

    const showStats = async () => {
        dispatch({type: SHOW_STATS_BEGIN});
        try {
            const {data} = await authFetch('/tasks/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS, 
                payload: {
                    stats: data.defaultStats,
                    monthlyTasks: data.monthlyTasks,
                },
            })
        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }

    const clearFilters = () => {
        dispatch({type: CLEAR_FILTERS});
    }

    const changePage = (page) => {
        dispatch({type: CHANGE_PAGE, payload: {page}})
    }

    return (
        <AppContext.Provider value={{...state, displayAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createTask, getTasks, setEditTask, editTask, deleteTask, showStats, clearFilters, changePage}}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }