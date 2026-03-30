# How to Add a New Project

Adding a new project to the portfolio requires only two steps.

## Step 1 — Add to `data/projects.json`

Open `data/projects.json` and add a new entry to the array:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "summary": "One or two sentences about what it does and why it matters.",
  "stack": ["Python", "AWS", "Whatever"],
  "github": "https://github.com/imihran/portfolio/tree/master/Public%20Project%20Files/my-new-project",
  "demo": null,
  "image": null,
  "featured": true
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | URL slug — must match the HTML filename (e.g. `my-new-project` → `projects/my-new-project.html`) |
| `title` | Yes | Project name shown on the card |
| `summary` | Yes | 1–2 sentence description for the homepage card |
| `stack` | Yes | Array of tech/tools used (shown as tags) |
| `github` | Yes | Link to source code or project folder |
| `demo` | No | Link to a live demo (set `null` if none) |
| `image` | No | Path to a screenshot or diagram (set `null` if none) |
| `featured` | Yes | Set `true` to show on the homepage |

## Step 2 — Create a project detail page

Copy any existing file in `projects/` as a template (e.g. `projects/reddit-analyzer.html`) and save it as `projects/my-new-project.html`.

Update these sections in the new file:

- `<title>` tag
- `<h1>` — project name
- `.project-meta` — tech tags
- `.summary` — short description
- Detail sections: **Problem**, **Approach**, **Technical Details** (optional), **Impact**
- `.detail-links` — link to source code / demo

## That's it

The homepage reads `data/projects.json` and renders cards automatically. No other files need to change.
