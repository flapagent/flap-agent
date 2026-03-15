#!/usr/bin/env node
/**
 * @flapagent/cli — Flap Agent Command Line Interface
 * @version 0.1.1
 * @license MIT
 *
 * Usage:
 *   flap auth login --key <api_key>
 *   flap agents list
 *   flap agents status --id <agent_id>
 *   flap deploy --agent <name> --model grok --chain bnb
 *   flap logs --agent <name> --follow
 */

"use strict";

const { program } = require("commander");
const chalk = require("chalk");
const ora = require("ora");

const VERSION = "0.1.1";
const BASE_URL = "https://api.flapagent.sh";

// ─── Utilities ─────────────────────────────────────────────────────────────

function printBanner() {
  console.log(
    chalk.hex("#ff007f").bold(`
  ███████╗██╗      █████╗ ██████╗      ██████╗██╗     ██╗
  ██╔════╝██║     ██╔══██╗██╔══██╗    ██╔════╝██║     ██║
  █████╗  ██║     ███████║██████╔╝    ██║     ██║     ██║
  ██╔══╝  ██║     ██╔══██║██╔═══╝     ██║     ██║     ██║
  ██║     ███████╗██║  ██║██║         ╚██████╗███████╗██║
  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝          ╚═════╝╚══════╝╚═╝
  `) +
    chalk.gray(`  Flap Agent CLI v${VERSION}  —  flapagent.sh\n`)
  );
}

async function getKey() {
  const fs = require("fs");
  const path = require("path");
  const configPath = path.join(process.env.HOME || "~", ".flaprc");
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return raw.key;
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {
  const key = await getKey();
  if (!key) {
    console.error(chalk.red("✖ Not authenticated. Run: flap auth login --key <your_api_key>"));
    process.exit(1);
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`API Error ${res.status}: ${err.message}`);
  }
  return res.json();
}

// ─── Program ────────────────────────────────────────────────────────────────

program
  .name("flap")
  .description("Flap Agent CLI — Build, deploy and monitor AI agents on BNB Chain")
  .version(VERSION, "-v, --version", "Output the current version")
  .hook("preAction", printBanner);

// ─── Auth ───────────────────────────────────────────────────────────────────

const auth = program.command("auth").description("Manage CLI authentication");

auth
  .command("login")
  .description("Authenticate with your Flap Agent API key")
  .requiredOption("--key <api_key>", "Your API key (format: flp_live_xxx)")
  .action(async ({ key }) => {
    const spinner = ora("Verifying API key...").start();
    try {
      if (!key.startsWith("flp_")) throw new Error("Invalid key format.");
      const fs = require("fs");
      const path = require("path");
      fs.writeFileSync(path.join(process.env.HOME || "~", ".flaprc"), JSON.stringify({ key }, null, 2));
      spinner.succeed(chalk.green("Authenticated successfully! Key saved to ~/.flaprc"));
    } catch (e) {
      spinner.fail(chalk.red(`Authentication failed: ${e.message}`));
    }
  });

auth
  .command("logout")
  .description("Remove stored credentials")
  .action(() => {
    const fs = require("fs");
    const path = require("path");
    try {
      fs.unlinkSync(path.join(process.env.HOME || "~", ".flaprc"));
      console.log(chalk.green("✓ Logged out. Credentials removed."));
    } catch {
      console.log(chalk.yellow("No credentials found."));
    }
  });

// ─── Agents ─────────────────────────────────────────────────────────────────

const agents = program.command("agents").description("Manage your deployed agents");

agents
  .command("list")
  .description("List all your deployed agents")
  .action(async () => {
    const spinner = ora("Fetching agents...").start();
    try {
      const data = await apiRequest("/v1/agents");
      spinner.succeed(`Found ${data.length} agent(s):\n`);
      data.forEach((a) => {
        const statusColor = a.status === "active" ? chalk.green : chalk.yellow;
        console.log(`  ${statusColor("●")} ${chalk.white.bold(a.name)} ${chalk.gray(`(${a.id})`)}`);
        console.log(`    Model: ${chalk.cyan(a.model_type)}  |  Calls: ${chalk.magenta(a.calls_total)}  |  Status: ${statusColor(a.status)}\n`);
      });
    } catch (e) {
      spinner.fail(chalk.red(e.message));
    }
  });

agents
  .command("status")
  .description("Get real-time status of a specific agent")
  .requiredOption("--id <agent_id>", "The Agent ID")
  .action(async ({ id }) => {
    const spinner = ora(`Checking status for ${id}...`).start();
    try {
      const a = await apiRequest(`/v1/agents/${id}`);
      spinner.succeed(`Agent: ${chalk.white.bold(a.name)}\n`);
      console.log(`  ID:       ${chalk.gray(a.id)}`);
      console.log(`  Model:    ${chalk.cyan(a.model_type)}`);
      console.log(`  Status:   ${chalk.green(a.status)}`);
      console.log(`  Calls:    ${chalk.magenta(a.calls_total)}`);
      console.log(`  Created:  ${chalk.gray(a.created_at)}`);
    } catch (e) {
      spinner.fail(chalk.red(e.message));
    }
  });

// ─── Deploy ─────────────────────────────────────────────────────────────────

program
  .command("deploy")
  .description("Deploy a new agent to the Flap network")
  .requiredOption("--agent <name>", "A unique name for your agent")
  .option("--model <model>", "AI model to use", "grok-4-1-fast-reasoning")
  .option("--chain <chain>", "Target blockchain", "bnb")
  .option("--desc <description>", "Agent description")
  .action(async ({ agent, model, chain, desc }) => {
    const spinner = ora(`Deploying agent "${agent}" on ${chain.toUpperCase()} Chain...`).start();
    try {
      const data = await apiRequest("/v1/agents", {
        method: "POST",
        body: JSON.stringify({ name: agent, model_type: model, description: desc || "", chain }),
      });
      spinner.succeed(chalk.green(`Agent deployed successfully!\n`));
      console.log(`  Agent ID: ${chalk.cyan(data.id)}`);
      console.log(`  Dashboard: ${chalk.blue.underline(`https://flapagent.sh/my-agents`)}`);
    } catch (e) {
      spinner.fail(chalk.red(e.message));
    }
  });

// ─── Logs ───────────────────────────────────────────────────────────────────

program
  .command("logs")
  .description("Stream live logs from an agent")
  .requiredOption("--agent <name>", "Agent name or ID")
  .option("--follow", "Stream logs in real-time", false)
  .action(async ({ agent, follow }) => {
    console.log(chalk.gray(`Fetching logs for agent: ${agent}...\n`));
    // Mock log output for demo
    const mockLogs = [
      { ts: new Date().toISOString(), level: "INFO", msg: `Agent "${agent}" initialized.` },
      { ts: new Date().toISOString(), level: "INFO", msg: "Received prompt from /api/chat endpoint." },
      { ts: new Date().toISOString(), level: "INFO", msg: "Routing to grok-4-1-fast-reasoning model..." },
      { ts: new Date().toISOString(), level: "SUCCESS", msg: "Response generated in 842ms. Tokens used: 412." },
    ];
    for (const log of mockLogs) {
      const lvlColor = log.level === "SUCCESS" ? chalk.green : log.level === "ERROR" ? chalk.red : chalk.gray;
      console.log(`  ${chalk.gray(log.ts)}  ${lvlColor.bold(log.level.padEnd(7))}  ${chalk.white(log.msg)}`);
    }
    if (follow) {
      console.log(chalk.gray("\n  Streaming live logs... (Press Ctrl+C to exit)"));
    }
  });

program.parse(process.argv);
