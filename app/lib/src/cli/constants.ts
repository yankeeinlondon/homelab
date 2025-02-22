import { dirname } from "pathe";
import "dotenv/config";

export const CLI_DIRECTORY = dirname(import.meta.url);

/**
 * Locations where a config file might exist.
 *
 * - ordered by the order they are checked.
 */
export const CONFIG_LOCATIONS = [
  `${CLI_DIRECTORY}/.homelab.ts`,
  `${CLI_DIRECTORY}/.homelab.yaml`,
  `${process.env.HOME}/.homelab.yaml`,
  `${process.env.HOME}/.config/homelab/config.yaml`,
] as const;

export const DEFAULT_CONFIG_LOCATION = `${process.env.HOME}/.config/homelab/config.yaml` as const;
