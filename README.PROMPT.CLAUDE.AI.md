Initial prompt for claude.ai:
I would like a web application that I could host in a server in my network where I could bring markdown files into the (static?) site, and users could use a library/module/function to be able to edit the content and then save the markdown file back in GitHub.  Could you create this app step by step using the Astro framework and the Quill editor?  If there's a better choice of editor, I'm open to changing it, but I like Quill.  Also, if you need to add additional libraries or modules, that's totally fine too.

Next prompt for claude.ai:
In your last reply, you have a heading that says "Updated Editor Component", but it doesn't contain that - it instead contains a copy of the project setup steps.  Could you validate that you sent me the correct file and/or send me the updated editor component that uses the github.js component?

Next prompt for claude.ai:

Now when I run, there is an error from Astro : 10:54:23 [ERROR] document is not defined
  Hint:
    Browser APIs are not available on the server.

    If the code is in a framework component, try to access these objects after rendering using lifecycle methods or use a client:only directive to make the component exclusively run on the client.

    See https://docs.astro.build/en/guides/troubleshooting/#document-or-window-is-not-defined for more information.

  Stack trace:
    at /home/bryan_vold/src/astro-quill-github/astro-markdown-editor/node_modules/quill/core/emitter.js:7:3
    [...] See full stack trace in the browser, or rerun with --verbose.

Next Prompt for claude.ai:

Now the Quill editor is displayed, but when I try to open a markdown file from a github repo, it gives an error in the JavaScript console: Error fetching file from GitHub: ReferenceError: Buffer is not defined
    at GitHubService.getFile (github.js:19:23)
    at async loadFile (Editor.jsx:32:32)


