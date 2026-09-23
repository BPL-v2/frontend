import { Permission } from "@api/generated/models";

import { createElement, JSX } from "react";
import { Navigate } from "@tanstack/react-router";
type TokenPayload = {
  exp: number;
  permissions: Permission[];
  user_id: number;
};

function getJwtPayload(): TokenPayload | null {
  const token = localStorage.getItem("auth");
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export function getPermissions(): Permission[] {
  const payload = getJwtPayload();
  if (payload == null) {
    return [];
  }
  return payload.permissions;
}

function isValidJwt(payload: TokenPayload | null): boolean {
  return payload != null && payload.exp * 1000 > Date.now();
}

export function isLoggedIn() {
  return isValidJwt(getJwtPayload());
}

export function isAdmin() {
  const payload = getJwtPayload();
  return (
    payload != null &&
    isValidJwt(payload) &&
    payload.permissions.includes(Permission.admin)
  );
}

function hasPermission(permissions: Permission[]): boolean {
  const payload = getJwtPayload();
  return (
    payload != null &&
    isValidJwt(payload) &&
    permissions.some((permission) => payload.permissions.includes(permission))
  );
}

export function renderConditionally(
  component: () => JSX.Element,
  permissions: Permission[],
): () => JSX.Element | undefined {
  if (hasPermission(permissions)) {
    return component;
  } else {
    return () => createElement(Navigate, { to: "/", replace: true });
  }
}
