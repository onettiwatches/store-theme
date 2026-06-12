# Onetti Watches Shopify Theme

Custom Shopify theme for the Onetti Watches store.

## Local Development

Prereqs: Node 18+, partner access to the `onetti-watches` store.

```bash
npm install -g @shopify/cli @shopify/theme
shopify auth login
shopify theme dev --store onetti-watches
```

CLI prints a local URL (default `http://127.0.0.1:9292`) and hot-reloads on save.

Other commands:

| Command | Purpose |
|---------|---------|
| `shopify theme check` | Lint theme |
