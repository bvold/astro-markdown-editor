// src/utils/github.js

import { Octokit } from "@octokit/rest";

export class GitHubService {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  async getFile(owner, repo, path, branch = 'main') {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      const content = Buffer.from(response.data.content, 'base64').toString();
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
        content: Buffer.from(content).toString('base64'),
        sha,
        branch,
      });
    } catch (error) {
      console.error('Error saving file to GitHub:', error);
      throw error;
    }
  }
}

// Usage example:
// const github = new GitHubService('your-github-token');
// const { content, sha } = await github.getFile('owner', 'repo', 'path/to/file.md');
// await github.saveFile('owner', 'repo', 'path/to/file.md', 'New content', 'Update file', sha);