// src/utils/github.js
import { Octokit } from "@octokit/rest";

export class GitHubService {
  constructor() {
    this.octokit = new Octokit({ auth: import.meta.env.PUBLIC_GITHUB_TOKEN });
  }

  async getFile(owner, repo, path) {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return {
        content: atob(response.data.content),
        sha: response.data.sha,
      };
    } catch (error) {
      console.error('Error fetching file from GitHub:', error);
      throw new Error(`Failed to fetch file: ${error.message}`);
    }
  }

  async saveFile(owner, repo, path, content, message, sha) {
    try {
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: btoa(unescape(encodeURIComponent(content))), // Ensure proper encoding of Unicode characters
        sha,
      });
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error saving file to GitHub:', error);
      if (error.response) {
        console.error('GitHub API response:', error.response.data);
      }
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }
}