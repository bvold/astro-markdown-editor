// src/utils/github.js

import { Octokit } from "@octokit/rest";

export class GitHubService {
  constructor() {
    this.octokit = new Octokit({ auth: import.meta.env.PUBLIC_GITHUB_TOKEN });
  }

  async getFile(owner, repo, path, branch = 'main') {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      const content = atob(response.data.content);
      return { content, sha: response.data.sha };
    } catch (error) {
      console.error('Error fetching file from GitHub:', error);
      throw error;
    }
  }

  async saveFile(owner, repo, path, content, message, sha, branch = 'main') {
    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: btoa(content),
        sha,
        branch,
      });
    } catch (error) {
      console.error('Error saving file to GitHub:', error);
      throw error;
    }
  }
}