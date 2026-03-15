/**
 * @flapagent/sdk - Flap Agent TypeScript SDK
 * @version 0.1.1
 * @license MIT
 *
 * Initialize the Flap Agent SDK and interact with your deployed agents
 * programmatically from any Node.js or browser environment.
 *
 * @example
 * ```typescript
 * import { FlapSDK } from "@flapagent/sdk";
 *
 * const sdk = new FlapSDK({ apiKey: "flp_live_xxx" });
 * const result = await sdk.chat({ agentId: "my-scanner", prompt: "Analyze BNB price" });
 * console.log(result.content);
 * ```
 */

export interface FlapConfig {
  /** Your Flap Agent API key (format: flp_live_xxx) */
  apiKey: string;
  /** Base URL for the Flap Agent API. Defaults to https://api.flapagent.sh */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000 */
  timeoutMs?: number;
}

export interface ChatRequest {
  /** The deployed Agent ID to query */
  agentId: string;
  /** The user prompt to send to the agent */
  prompt: string;
  /** AI model to use. Defaults to 'grok-4-1-fast-reasoning' */
  model?: "gpt-4o" | "grok-4-1-fast-reasoning" | "deepseek-v3";
  /** Whether to stream the response token by token */
  stream?: boolean;
  /** Optional platform context for multi-channel deployments */
  platform?: "telegram" | "x" | "web" | "api";
}

export interface ChatResponse {
  id: string;
  content: string;
  model: string;
  tokens_used: number;
  latency_ms: number;
  agent_id: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  model_type: string;
  calls_total: number;
  status: "active" | "paused" | "archived";
  created_at: string;
}

export class FlapSDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: FlapConfig) {
    if (!config.apiKey?.startsWith("flp_")) {
      throw new Error("Invalid API key format. Keys must start with 'flp_live_' or 'flp_test_'.");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://api.flapagent.sh";
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-SDK-Version": "0.1.1",
          ...options.headers,
        },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(`[FlapSDK] ${res.status}: ${error.message}`);
      }
      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Send a message to a deployed agent and receive a response.
   */
  async chat(req: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/v1/chat/${req.agentId}`, {
      method: "POST",
      body: JSON.stringify({
        prompt: req.prompt,
        model: req.model ?? "grok-4-1-fast-reasoning",
        stream: req.stream ?? false,
        platform: req.platform ?? "api",
      }),
    });
  }

  /**
   * List all agents associated with your API key.
   */
  async listAgents(): Promise<AgentInfo[]> {
    return this.request<AgentInfo[]>("/v1/agents");
  }

  /**
   * Get details for a single deployed agent.
   */
  async getAgent(agentId: string): Promise<AgentInfo> {
    return this.request<AgentInfo>(`/v1/agents/${agentId}`);
  }

  /**
   * Pause a deployed agent (stops it from receiving calls).
   */
  async pauseAgent(agentId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/v1/agents/${agentId}/pause`, { method: "POST" });
  }
}

export default FlapSDK;
