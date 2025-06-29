# API Configuration

## Changing the Base URL

To change the API base URL for your expense tracker app, you only need to update **one file**:

### File: `src/config/api.ts`

```typescript
export const API_CONFIG = {
  // Change this line to switch between local development and production
  BASE_URL: 'http://192.168.15.249:3000',  // Local development
  
  // Uncomment this line for production
  // BASE_URL: 'https://expense-tracker-q432.onrender.com',
  
  // ... rest of config
};
```

## Available Configurations

### Local Development
```typescript
BASE_URL: 'http://192.168.15.249:3000'
```

### Production (Render)
```typescript
BASE_URL: 'https://expense-tracker-q432.onrender.com'
```

### Custom Server
```typescript
BASE_URL: 'http://your-custom-server.com:port'
```

## Files That Use This Configuration

- ✅ `src/api/axiosInstance.ts` - Axios HTTP client
- ✅ `src/screens/ShortcutInstructions.tsx` - iOS Shortcut setup instructions
- ✅ All API service files (`src/api/*.ts`) automatically inherit the base URL

## Benefits

- **Single source of truth** - Change URL in one place only
- **Environment switching** - Easy to switch between local/production
- **Centralized endpoints** - All API endpoints are defined in one place
- **Type safety** - TypeScript support for all configurations
