import { invoke } from "@tauri-apps/api/core";

export function invokeCommand<T>(command: string, payload?: Record<string, unknown>) {
  return invoke<T>(command, payload);
}
