import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "./slices/accountSlice";
import { appSlice } from "./slices/appSlice";
import { categoriesSlice } from "./slices/categoriesSlice";
import { todosSlice } from "./slices/todosSlice";

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    account: accountSlice.reducer,
    categories: categoriesSlice.reducer,
    todos: todosSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
