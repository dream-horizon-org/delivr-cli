# Server URL Configuration

The Delivr CLI allows you to configure the backend server URL in multiple ways, with a clear priority order.

## Configuration Priority

The CLI resolves the server URL in the following order (highest to lowest priority):

1. **CLI Option** (`--server` or `-s`)
2. **Environment Variable** (`DELIVR_SERVER_URL` or `CODE_PUSH_SERVER_URL`)
3. **Default** (`http://localhost:3000`)

## Methods

### 1. Using CLI Option (Highest Priority)

You can specify the server URL directly when running commands:

```bash
# Login to custom server
delivr login --server https://your-delivr-server.com

# Or using short alias
delivr login -s https://your-delivr-server.com

# Register on custom server
delivr register --server https://your-delivr-server.com

# Link to custom server
delivr link --server https://your-delivr-server.com
```

### 2. Using Environment Variable

Set the environment variable before running commands:

#### Bash/Zsh (Mac/Linux)
```bash
# Set for current session
export DELIVR_SERVER_URL=https://your-delivr-server.com

# Or set for single command
DELIVR_SERVER_URL=https://your-delivr-server.com delivr login

# Add to ~/.bashrc or ~/.zshrc for permanent configuration
echo 'export DELIVR_SERVER_URL=https://your-delivr-server.com' >> ~/.zshrc
```

#### Windows CMD
```cmd
set DELIVR_SERVER_URL=https://your-delivr-server.com
delivr login
```

#### Windows PowerShell
```powershell
$env:DELIVR_SERVER_URL="https://your-delivr-server.com"
delivr login
```

#### Legacy Support
The CLI also supports the legacy `CODE_PUSH_SERVER_URL` environment variable for backward compatibility:
```bash
export CODE_PUSH_SERVER_URL=https://your-delivr-server.com
```

### 3. Default Server

If no server URL is specified via CLI option or environment variable, the CLI defaults to:
```
http://localhost:3000
```

This is useful for local development and testing.

## Complete Examples

### Example 1: Using CLI Option
```bash
# Login with custom server
delivr login --server https://delivr.example.com --accessKey mykey123

# All subsequent commands use the server URL stored during login
delivr app list
delivr release MyApp/iOS ./build "*"
```

### Example 2: Using Environment Variable
```bash
# Set environment variable
export DELIVR_SERVER_URL=https://delivr.example.com

# Login (will use the environment variable)
delivr login

# All commands use the configured server
delivr app add MyNewApp
delivr deployment list MyNewApp
```

### Example 3: Per-Command Override
```bash
# Default environment
export DELIVR_SERVER_URL=https://production-server.com

# Override for a specific command
delivr login --server https://staging-server.com --accessKey staging-key

# Login to production server later
delivr login  # Uses environment variable (production)
```

### Example 4: Local Development
```bash
# No configuration needed - defaults to localhost
delivr login  # Connects to http://localhost:3000

# Or explicitly set for clarity
delivr login --server http://localhost:3000
```

### Example 5: Release to Different Server
```bash
# Login to production server
delivr login --server https://production-server.com

# But release to staging server for this specific release
delivr release MyOrg/MyApp ./build "1.0.0" --server https://staging-server.com -d Staging

# Or with React Native
delivr release-react MyOrg/MyApp ios --server https://staging-server.com
```

### Example 6: Multi-Environment CI/CD
```bash
# In your CI/CD pipeline
# Deploy to staging
DELIVR_SERVER_URL=https://staging.delivr.com delivr login --accessKey $STAGING_KEY
delivr release-react MyOrg/MyApp android -d Staging

# Deploy to production (override with CLI option)
delivr release-react MyOrg/MyApp android -d Production --server https://production.delivr.com
```

## Configuration Persistence

Once you successfully login, the server URL is stored in your configuration file:
- **Mac/Linux**: `~/.code-push.config`
- **Windows**: `%LOCALAPPDATA%/.code-push.config`

The stored configuration includes:
```json
{
  "accessKey": "your-access-key",
  "preserveAccessKeyOnLogout": false,
  "customServerUrl": "https://your-delivr-server.com"
}
```

All subsequent commands will use the server URL from this configuration file until you logout or login to a different server.

## Supported Commands

The following commands support the `--server` option:

- `delivr login [--server URL]`
- `delivr register [--server URL]`
- `delivr link [--server URL]`
- `delivr release <app> <package> <version> [--server URL] [-s URL]`
- `delivr release-react <app> <platform> [--server URL]`

**Note**: For `release` command, you can use `-s` as a short alias for `--server`. For `release-react`, only `--server` is available (since `-s` is used for `--sourcemapOutput`).

All other commands (like `app list`, `deployment add`, etc.) automatically use the server URL from your stored configuration.

## Tips

1. **Production Setup**: Set `DELIVR_SERVER_URL` in your environment for consistent usage
2. **Development**: Use `--server http://localhost:3000` when testing locally
3. **CI/CD**: Export `DELIVR_SERVER_URL` in your CI/CD pipeline environment
4. **Multiple Servers**: Use `--server` option to quickly switch between servers
5. **Check Current Config**: Your current server is stored in `~/.code-push.config`

## Troubleshooting

### Check Current Configuration
```bash
# View your current config (Mac/Linux)
cat ~/.code-push.config

# View your current config (Windows)
type %LOCALAPPDATA%\.code-push.config
```

### Reset Configuration
```bash
# Logout to clear stored configuration
delivr logout

# Login again with desired server
delivr login --server https://your-new-server.com
```

### Verify Server URL
When logging in, the CLI will display which server it's connecting to. Check the output for confirmation.

## Security Notes

- Always use HTTPS for production servers
- The access key is stored in plain text in the config file - protect this file appropriately
- Different server URLs may require different access keys

