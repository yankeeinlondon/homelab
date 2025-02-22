import type { HomelabConfig } from "~/types";

export function homelab<T extends HomelabConfig>(config: T): HomelabConfig {
  return config;
}
