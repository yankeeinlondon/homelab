---
files: 
    - "package.json"
---

## Context

This repo is centered around the idea of a "homelab" and is intended to be a monorepo with the following modules:

1. `lib` - Typescript library which provides useful API's to services like Pihole, Proxmox, etc.
2. `cli` - a CLI tool which leverages the `lib` module to take actions
3. `api` - a higher level API surface which leverages to the `lib` module to make individual calls to various servers in the homelab
4. `ui`  - a web based container which works the `api` module to provide it with data


