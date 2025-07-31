# AfriXa Deployment Configuration

## Deployment Settings

Your deployment is now configured with the following settings:

### Runtime
- **Node.js 18** (specified in `.nvmrc` and `netlify.toml`)

### Base Directory
- **`/afrixa2`** (specified in `netlify.toml`)

### Package Directory
- **Not set** (uses default `node_modules` in base directory)

### Build Command
- **`npm run build`** (specified in `netlify.toml`)

### Publish Directory
- **`/afrixa2/.next`** (specified in `netlify.toml`)

### Functions Directory
- **`/afrixa2/netlify/functions`** (specified in `netlify.toml`)

### Deploy Log Visibility
- **Logs are public** (default setting)

### Build Status
- **Active** (default setting)

## Files Created/Modified

1. **`netlify.toml`** - Main deployment configuration
2. **`next.config.ts`** - Updated for static export
3. **`package.json`** - Added export script
4. **`.nvmrc`** - Node.js version specification
5. **`netlify/functions/`** - Functions directory with sample function

## Deployment Steps

1. **Connect your repository** to Netlify
2. **Set the base directory** to `afrixa2` in Netlify dashboard
3. **Deploy** - Netlify will automatically use the `netlify.toml` configuration

## Environment Variables

If you need to set environment variables for your deployment:

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add any required environment variables (e.g., Firebase config)

## Custom Domain

To set up a custom domain:

1. Go to your Netlify dashboard
2. Navigate to Domain management
3. Add your custom domain
4. Configure DNS settings as instructed

## Functions

The `netlify/functions/` directory contains serverless functions. You can add more functions here as needed.

## Troubleshooting

- If build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check for any server-side code that needs to be converted for static export 