# Atlas Authentication API - Onboarding Endpoints

## Base URL
```
http://localhost:8001/api/v1
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Assign Role (Onboarding Step 1)

Allows authenticated users to select their role during the onboarding process.

**Endpoint:** `POST /users/role`

**Security:**
- ✅ Only authenticated users
- ✅ Only `coach` and `analyst` roles can be assigned
- ✅ `admin` role is **blocked** (403 Forbidden)
- ✅ Role can only be set **once** (409 Conflict on retry)

#### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "role": "coach"
}
```

**Allowed Values:**
- `"coach"` ✅
- `"analyst"` ✅
- `"admin"` ❌ (403 Forbidden)

#### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "email": "user@atlas.com",
  "roles": ["coach"],
  "profile_completed": false,
  "first_name": null,
  "last_name": null,
  "organization": null,
  "level": null,
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-01-03T10:00:00Z",
  "updated_at": "2026-01-03T10:05:00Z"
}
```

**Error (403 Forbidden) - Invalid Role:**
```json
{
  "detail": "Role 'admin' cannot be self-assigned. Only coach, analyst are allowed."
}
```

**Error (409 Conflict) - Role Already Set:**
```json
{
  "detail": "Role already assigned. Cannot change role once set."
}
```

**Error (401 Unauthorized) - No Token:**
```json
{
  "detail": "Not authenticated"
}
```

**Error (422 Unprocessable Entity) - Invalid Format:**
```json
{
  "detail": [
    {
      "loc": ["body", "role"],
      "msg": "String should match pattern '^(coach|analyst)$'",
      "type": "string_pattern_mismatch"
    }
  ]
}
```

#### Example Usage

**cURL:**
```bash
curl -X POST http://localhost:8001/api/v1/users/role \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"role": "coach"}'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8001/api/v1/users/role', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ role: 'coach' })
});

const userData = await response.json();
console.log('Role assigned:', userData.roles);
```

**Python (requests):**
```python
import requests

response = requests.post(
    'http://localhost:8001/api/v1/users/role',
    headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    },
    json={'role': 'coach'}
)

user_data = response.json()
print(f"Role assigned: {user_data['roles']}")
```

---

### 2. Complete Profile (Onboarding Step 2)

Allows authenticated users to complete their profile information.

**Endpoint:** `POST /users/profile`

**Security:**
- ✅ Only authenticated users
- ✅ Users can only update their own profile
- ✅ Input validation and sanitization

#### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "organization": "FC Example",
  "level": "pro"
}
```

**Field Requirements:**

| Field | Type | Min | Max | Allowed Values |
|-------|------|-----|-----|----------------|
| `first_name` | string | 1 | 100 | Any text |
| `last_name` | string | 1 | 100 | Any text |
| `organization` | string | 1 | 255 | Any text |
| `level` | string | - | - | `amateur`, `semi-pro`, `pro` |

**Notes:**
- All text fields will have leading/trailing whitespace removed
- `level` must be one of the three allowed values (case-insensitive)
- Setting profile automatically marks `profile_completed` as `true`

#### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "email": "user@atlas.com",
  "roles": ["coach"],
  "profile_completed": true,
  "first_name": "Jean",
  "last_name": "Dupont",
  "organization": "FC Example",
  "level": "pro",
  "full_name": "Jean Dupont",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-01-03T10:00:00Z",
  "updated_at": "2026-01-03T10:10:00Z"
}
```

**Error (422 Unprocessable Entity) - Invalid Level:**
```json
{
  "detail": [
    {
      "loc": ["body", "level"],
      "msg": "Invalid level. Must be one of: amateur, semi-pro, pro",
      "type": "value_error"
    }
  ]
}
```

**Error (422 Unprocessable Entity) - Missing Field:**
```json
{
  "detail": [
    {
      "loc": ["body", "first_name"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

**Error (401 Unauthorized):**
```json
{
  "detail": "Not authenticated"
}
```

#### Example Usage

**cURL:**
```bash
curl -X POST http://localhost:8001/api/v1/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "organization": "FC Example",
    "level": "pro"
  }'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8001/api/v1/users/profile', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'Jean',
    last_name: 'Dupont',
    organization: 'FC Example',
    level: 'pro'
  })
});

const userData = await response.json();
console.log('Profile completed:', userData.profile_completed);
```

**Python (requests):**
```python
import requests

response = requests.post(
    'http://localhost:8001/api/v1/users/profile',
    headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    },
    json={
        'first_name': 'Jean',
        'last_name': 'Dupont',
        'organization': 'FC Example',
        'level': 'pro'
    }
)

user_data = response.json()
print(f"Profile completed: {user_data['profile_completed']}")
```

---

### 3. Get Current User

Retrieve information about the currently authenticated user.

**Endpoint:** `GET /auth/me`

**Security:**
- ✅ Only authenticated users
- ✅ Returns only the user's own data

#### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

#### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "email": "user@atlas.com",
  "roles": ["coach"],
  "profile_completed": true,
  "first_name": "Jean",
  "last_name": "Dupont",
  "organization": "FC Example",
  "level": "pro",
  "full_name": "Jean Dupont",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-01-03T10:00:00Z",
  "updated_at": "2026-01-03T10:10:00Z"
}
```

**Error (401 Unauthorized):**
```json
{
  "detail": "Not authenticated"
}
```

#### Example Usage

**cURL:**
```bash
curl -X GET http://localhost:8001/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8001/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const userData = await response.json();
console.log('Current user:', userData);
```

**Python (requests):**
```python
import requests

response = requests.get(
    'http://localhost:8001/api/v1/auth/me',
    headers={'Authorization': f'Bearer {access_token}'}
)

user_data = response.json()
print(f"Current user: {user_data['email']}")
```

---

## Complete Onboarding Flow

### Step-by-Step Integration

1. **User Registration/Login**
   ```javascript
   // Register new user
   const registerResponse = await fetch('/api/v1/auth/register', {
     method: 'POST',
     body: JSON.stringify({
       email: 'user@atlas.com',
       password: 'SecurePass123!',
       full_name: 'New User'
     })
   });
   
   const { access_token } = await registerResponse.json();
   ```

2. **Check Onboarding Status**
   ```javascript
   // Get current user
   const userResponse = await fetch('/api/v1/auth/me', {
     headers: { 'Authorization': `Bearer ${access_token}` }
   });
   
   const user = await userResponse.json();
   
   // Check if onboarding needed
   const needsOnboarding = !user.roles.length || !user.profile_completed;
   ```

3. **Role Selection (if needed)**
   ```javascript
   if (!user.roles.length) {
     const roleResponse = await fetch('/api/v1/users/role', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${access_token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ role: 'coach' })
     });
     
     const updatedUser = await roleResponse.json();
   }
   ```

4. **Profile Completion (if needed)**
   ```javascript
   if (!user.profile_completed) {
     const profileResponse = await fetch('/api/v1/users/profile', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${access_token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         first_name: 'Jean',
         last_name: 'Dupont',
         organization: 'FC Example',
         level: 'pro'
       })
     });
     
     const completedUser = await profileResponse.json();
   }
   ```

5. **Redirect to Dashboard**
   ```javascript
   // User is fully onboarded, proceed to main app
   window.location.href = '/dashboard';
   ```

---

## Error Handling Best Practices

### Frontend Error Handling

```javascript
async function assignRole(accessToken, role) {
  try {
    const response = await fetch('http://localhost:8001/api/v1/users/role', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role })
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 401:
          // Token expired or invalid - redirect to login
          window.location.href = '/login';
          break;
          
        case 403:
          // Invalid role attempted
          throw new Error('You cannot assign yourself this role');
          
        case 409:
          // Role already assigned
          throw new Error('Your role has already been set');
          
        case 422:
          // Validation error
          throw new Error('Invalid role format');
          
        default:
          throw new Error('An unexpected error occurred');
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Role assignment failed:', error);
    throw error;
  }
}
```

---

## Testing with FastAPI Swagger UI

1. Open http://localhost:8001/docs in your browser
2. Click **Authorize** button (top right)
3. Enter: `Bearer <your_jwt_token>`
4. Click **Authorize**
5. Now you can test all endpoints interactively

### Quick Test Sequence

1. **POST /api/v1/auth/register** - Create account
2. **POST /api/v1/auth/login** - Get JWT token
3. **Authorize** - Add Bearer token
4. **GET /api/v1/auth/me** - Check current status
5. **POST /api/v1/users/role** - Assign role
6. **POST /api/v1/users/profile** - Complete profile
7. **GET /api/v1/auth/me** - Verify completion

---

## Security Notes

### ⚠️ Important Security Considerations

1. **Admin Role Protection**
   - The `admin` role **cannot** be assigned via API
   - Any attempt returns 403 Forbidden
   - Admin must be set manually in database

2. **Token Security**
   - Always use HTTPS in production
   - Never log or expose JWT tokens
   - Store refresh tokens securely

3. **Role Immutability**
   - Once a role is assigned, it cannot be changed via API
   - This prevents privilege escalation attacks
   - Contact admin to change roles

4. **Input Validation**
   - All inputs are validated at multiple layers
   - Whitespace is automatically trimmed
   - Invalid data is rejected before reaching database

---

## Rate Limiting Recommendations

Consider implementing rate limiting in production:

```
POST /api/v1/users/role: 5 requests per hour per user
POST /api/v1/users/profile: 10 requests per hour per user
GET /api/v1/auth/me: 100 requests per hour per user
```

---

## Support

For issues or questions:
- Check [SECURITY.md](./SECURITY.md) for security model details
- Review FastAPI docs at http://localhost:8001/docs
- Contact backend team

---

**Version:** 1.0.0  
**Last Updated:** January 3, 2026
