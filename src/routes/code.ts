import { Router } from "express";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir" | "symlink" | "submodule";
  content?: string;
  encoding?: string;
}

interface TypeScriptFiles {
  [filename: string]: string;
}

class GitHubApiFetcher {
  private accessToken: string;
  private owner: string;
  private repo: string;
  private branch: string;
  private typeScriptFiles: TypeScriptFiles = {};

  constructor(
    accessToken: string,
    owner: string,
    repo: string,
    branch: string
  ) {
    this.accessToken = accessToken;
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  private async fetchContent(
    path: string = ""
  ): Promise<GitHubContent | GitHubContent[]> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
    const headers = {
      Authorization: `token ${this.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    try {
      const response = await axios.get<GitHubContent | GitHubContent[]>(url, {
        headers,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching content:", error.response?.data);
      } else {
        console.error("Error fetching content:", error);
      }
      throw error;
    }
  }

  private processTypeScriptFile(content: GitHubContent): void {
    if (
      content.content &&
      content.encoding === "base64" &&
      content.name.endsWith(".ts")
    ) {
      const decodedContent = Buffer.from(content.content, "base64").toString(
        "utf-8"
      );
      this.typeScriptFiles[content.path] = decodedContent;
      console.log(`Processed TypeScript file: ${content.path}`);
    }
  }

  public async fetchTypeScriptFiles(currentPath: string = ""): Promise<void> {
    const content = await this.fetchContent(currentPath);

    if (Array.isArray(content)) {
      for (const item of content) {
        if (item.type === "dir") {
          await this.fetchTypeScriptFiles(item.path);
        } else if (
          (item.type === "file" && item.name.endsWith(".ts")) ||
          item.name.endsWith(".tsx")
        ) {
          const fileContent = (await this.fetchContent(
            item.path
          )) as GitHubContent;
          this.processTypeScriptFile(fileContent);
        }
      }
    } else if (
      (content.type === "file" && content.name.endsWith(".ts")) ||
      content.name.endsWith(".tsx")
    ) {
      this.processTypeScriptFile(content);
    }
  }

  public getTypeScriptFiles(): TypeScriptFiles {
    return this.typeScriptFiles;
  }

  public saveTypeScriptFilesAsJson(): string {
    return JSON.stringify(this.typeScriptFiles, null, 2);
  }
}

const codeRouter = Router();

codeRouter.get("/", async (_, res) => {
  const accessToken = process.env.GITHUB_ACCESSTOKEN ?? ""; // Replace with your actual access token
  const owner = "han-kimm";
  const repo = "vegwins-fe";
  const branch = "main";

  const fetcher = new GitHubApiFetcher(accessToken, owner, repo, branch);

  try {
    await fetcher.fetchTypeScriptFiles();
    const code = fetcher.saveTypeScriptFilesAsJson();

    return res.send({ code });
  } catch (error) {
    return res.status(500).send({ error: "An error occurred" });
  }
});

export default codeRouter;
