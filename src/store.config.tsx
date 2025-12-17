// src/store.config.ts
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import type { PropsWithChildren } from "react";

export function StoreProvider({ children }: PropsWithChildren<{}>) {
  return React.createElement(Provider as any, { store }, children);
}
