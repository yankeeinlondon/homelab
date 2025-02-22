---
files: 
    - app/**/*.ts
    - .npmrc
web:
    - https://turbo.build/repo/docs/getting-started/examples
---
## Task

I want to turn this repo into a monorepo and use "turborepo" to do my builds. All projects in this repo are found under `/app/...`. The current implementations files are broadly where they should be but I just moved them quickly so nothing is build-ready yet.

- The first module/app I want to build is the `lib` module.
- After that, i'll build the `cli` module which will import the `lib` functions to do it's job
- The `api` module will come next also import the `lib` module and provide it's own API service as it's core utility
- Finally, the `ui` modules will be a web based frontend that will will connect to the `api` module over the network to do some tasks but will likely also import the `lib` module itself so it can leverage those functions too.

### Other Tech Considerations

- I have not used Turbo Repo in a long time but I have used it
- I am using `pnpm` as the package manager

### NPM Registry versus Docker

To install the `lib` module I'm expecting to be able to add it to another repo with:

```sh
pnpm add @yankeeinlondon/homelab
```

Doing this should import the library functions but would also provide the CLI as a binary. This means the CLI would be usable in this foreign repo's build scripts and so forth if that's useful. 

Likewise if a user wanted to have access to the CLI anywhere in the console they could install it globally with:

```sh
pnpm add -g @yankeeinlondon/homelab
```

and now the `hl` command would be available everywhere.

### Docker

For the `ui` and `api` components I was thinking these might be better built as a Docker container and deployed to Docker Hub (or elsewhere).


## Question

Can you help me get this repo setup so that:

- the repo is a proper monorepo from a pnpm perspective
- turborepo is configured to address the dependencies that exist between the various modules
- there are reasonable "scripts" in the root `package.json`



