#!/usr/bin/env bun

import * as fs from 'fs';
import { spawnSync, execSync } from 'child_process';
import process from 'process';
import chalk from 'chalk';
import {globSync} from 'fast-glob';
import "dotenv/config";

type ParsedMarkdown =[
    fm: Record<string, string>,
    content: string
]
  

function parseMarkdown(fileContent: string): ParsedMarkdown {

  // Check if the file starts with the frontmatter delimiter
  if (fileContent.startsWith('---')) {
    // Find the closing delimiter; start searching after the first '---'
    const endOfFrontmatter = fileContent.indexOf('---', 3);
    if (endOfFrontmatter !== -1) {
      // Extract the frontmatter content (skip the initial and ending '---')
      const frontMatterContent = fileContent.substring(3, endOfFrontmatter).trim();
      // The rest of the file is the markdown content
      const content = fileContent.substring(endOfFrontmatter + 3).trim();

      // Parse the frontmatter lines into a key/value object
      const frontMatter: Record<string, string> = {};
      const lines = frontMatterContent.split('\n');
      for (const line of lines) {
        // Expect lines of the form "key: value"
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          frontMatter[key] = value;
        }
      }

      return [ frontMatter, content ];
    }
  }
  
  // If no frontmatter is found, return an empty object for frontmatter and the full file as content.
  return [ {}, fileContent ];
}

/**
 * Reads and returns the content of a file.
 * Throws an error if the file does not exist.
 * @param filepath - path to the file
 * @returns file content as string
 */
export function getFile(filepath: string): [prompt: string, files: string[], web: string[]] {
    if(filepath.length < 50 && filepath.endsWith(".md") && !filepath.includes("/")) {
        filepath = `ai/prompts/${filepath}`
    }
  if (!fs.existsSync(filepath)) {
    throw new Error(`getFile() called but no file found at: ${filepath}`);
  }
  let raw = fs.readFileSync(filepath, { encoding: 'utf8' });
  let fm: Record<string,string>;
  let content: string;
  let files: string[] = [];
  let web: string[] = [];
  if (filepath.endsWith(".md")){
     [fm, content] = parseMarkdown(raw);
     if(Array.isArray(fm.files)) {

     }
  } else {
    content = raw;
  }

  return [content, files, web];
}

/**
 * Checks whether a command is available in the current environment.
 * @param cmd - command name to check
 * @returns true if command exists, false otherwise
 */
export function hasCommand(cmd: string): boolean {
  try {
    // Using shell built-in to check if command exists
    execSync(`command -v ${cmd}`, { stdio: 'ignore', env: process.env });
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs the chat command by reading context from a file,
 * verifying that the required command is installed, and
 * then invoking the external command with the provided prompt.
 * @param prompt - message prompt to send
 */
export function chat(prompt: string, files: string[]): void {
  let context: string;
  const websites: string[] = [];
  try {
    let moreFiles: string[];
    let web: string[];
    [context, moreFiles, web] = getFile('./ai/prompts/context.md');
    files.push(...moreFiles);
    websites.push(...web);
  } catch (error) {
    console.log(chalk.redBright("warning: ")  + `no context [${chalk.dim("ai/promps/context.md")}] provided. Question in raw form will be used.`);
    console.log();
    context = ""
  }

  if (prompt.length < 50 && prompt.endsWith(".md")) {
    let moreFiles: string[];
    let web: string[];
    [prompt, moreFiles, web] = getFile(prompt);
    files.push(...moreFiles);
    websites.push(...web);
  }

  // Use environment variables with defaults
  const MODEL = process.env.MODEL || 'o3-mini';
  const EDITOR_MODEL = process.env.EDITOR_MODEL || 'sonnet';
  const REASONING = process.env.REASONING || 'high';

  if (hasCommand('aider')) {
    console.log(`Starting [ ${MODEL}, ${EDITOR_MODEL}, ${REASONING} ]...`);

    const args: string[] = [
        '--model', MODEL,
        '--architect',
        '--reasoning-effort', REASONING,
        '--editor-model', EDITOR_MODEL,
        '--no-detect-urls',
        '--no-auto-commit',
        '--yes-always',

        ...files.reduce(
            (acc, i) => i.includes("*")
                ? [...acc, ...(globSync(i).reduce(
                    (group, file) => [ ...group, "--file", file], [] as string[]
                ))]
                : [ ...acc, "--file", i], [] as string[]
        ),
        ...websites.reduce(
            (acc,i) => [...acc, "--web", i], [] as string[]
        ),
        '--message', context + prompt
    ];

    // Spawn the aider command with the specified arguments
    const result = spawnSync('aider', args, { stdio: 'inherit', env: process.env });
    if (result.error) {
      console.error('Error running aider:', result.error);
      process.exit(1);
    }
  } else {
    console.error("- you don't have the aider assistant installed");
    console.error("- this is a requirement for running this chat prompt");
    console.error('');
    console.error("- install aider and then rerun");
    process.exit(1);
  }
}

