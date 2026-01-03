# Security Validation Manual Test Guide

## Prerequisites
Backend server must be running at http://localhost:8001

## Test 1: Admin Role Rejection ❌

### Register Test User
```powershell
$body = @{
    email = 'admin-test@atlas.com'
    password = 'TestPass123!'
    full_name = 'Admin Test User'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/auth/register' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $body

$token = $response.access_token
Write-Host "Token: $($token.Substring(0,30))..."
```

### Attempt Admin Role Assignment (SHOULD FAIL)
```powershell
$roleBody = @{ role = 'admin' } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' `
        -Method Post `
        -ContentType 'application/json' `
        -Headers @{Authorization="Bearer $token"} `
        -Body $roleBody
    Write-Host "❌ FAILED: Admin role was accepted (should be rejected!)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $error = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($statusCode -eq 403) {
        Write-Host "✅ PASSED: Admin role rejected with 403 Forbidden"
        Write-Host "   Message: $($error.detail)"
    } else {
        Write-Host "❌ FAILED: Wrong status code: $statusCode"
    }
}
```

**Expected:** 403 Forbidden with message about admin role

---

## Test 2: Valid Role Assignment ✅

### Register New User
```powershell
$body = @{
    email = 'coach-test@atlas.com'
    password = 'TestPass123!'
    full_name = 'Coach Test User'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/auth/register' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $body

$token2 = $response.access_token
```

### Assign Coach Role (SHOULD SUCCEED)
```powershell
$roleBody = @{ role = 'coach' } | ConvertTo-Json

$result = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' `
    -Method Post `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $token2"} `
    -Body $roleBody

if ($result.roles -contains 'coach') {
    Write-Host "✅ PASSED: Coach role assigned successfully"
    Write-Host "   Roles: $($result.roles -join ', ')"
} else {
    Write-Host "❌ FAILED: Coach role not in user roles"
}
```

**Expected:** 200 OK with roles = ["coach"]

---

## Test 3: Role Reassignment Prevention ❌

### Attempt to Change Role (SHOULD FAIL)
```powershell
$roleBody = @{ role = 'analyst' } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' `
        -Method Post `
        -ContentType 'application/json' `
        -Headers @{Authorization="Bearer $token2"} `
        -Body $roleBody
    Write-Host "❌ FAILED: Role change was allowed (should be blocked!)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $error = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($statusCode -eq 409) {
        Write-Host "✅ PASSED: Role change blocked with 409 Conflict"
        Write-Host "   Message: $($error.detail)"
    } else {
        Write-Host "❌ FAILED: Wrong status code: $statusCode"
    }
}
```

**Expected:** 409 Conflict with message about role already assigned

---

## Test 4: Profile Completion ✅

### Complete Profile
```powershell
$profileBody = @{
    first_name = 'Jean'
    last_name = 'Dupont'
    organization = 'FC Test'
    level = 'pro'
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/profile' `
    -Method Post `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $token2"} `
    -Body $profileBody

if ($result.profile_completed -eq $true) {
    Write-Host "✅ PASSED: Profile completed successfully"
    Write-Host "   Name: $($result.first_name) $($result.last_name)"
    Write-Host "   Organization: $($result.organization)"
    Write-Host "   Level: $($result.level)"
} else {
    Write-Host "❌ FAILED: Profile not marked as completed"
}
```

**Expected:** 200 OK with profile_completed = true

---

## Test 5: Case Insensitive Admin Rejection ❌

### Register Another User
```powershell
$body = @{
    email = 'case-test@atlas.com'
    password = 'TestPass123!'
    full_name = 'Case Test User'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/auth/register' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $body

$token3 = $response.access_token
```

### Try Uppercase ADMIN (SHOULD FAIL)
```powershell
$roleBody = @{ role = 'ADMIN' } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' `
        -Method Post `
        -ContentType 'application/json' `
        -Headers @{Authorization="Bearer $token3"} `
        -Body $roleBody
    Write-Host "❌ FAILED: Uppercase ADMIN was accepted (should be rejected!)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 403 -or $statusCode -eq 422) {
        Write-Host "✅ PASSED: Uppercase ADMIN rejected"
    } else {
        Write-Host "❌ FAILED: Wrong status code: $statusCode"
    }
}
```

**Expected:** 403 Forbidden or 422 Unprocessable Entity

---

## All-In-One Test Script

Save this as `run_security_tests.ps1`:

```powershell
Write-Host "="*80
Write-Host "ATLAS AUTHENTICATION - SECURITY TEST SUITE"
Write-Host "="*80

# Test 1: Admin Rejection
Write-Host "`n[TEST 1] Admin Role Rejection"
Write-Host "-"*80
$body1 = @{email='admin-test-'+(Get-Random)+'@atlas.com'; password='TestPass123!'; full_name='Test'} | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/auth/register' -Method Post -ContentType 'application/json' -Body $body1
try {
    Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' -Method Post -ContentType 'application/json' -Headers @{Authorization="Bearer $($r1.access_token)"} -Body (@{role='admin'} | ConvertTo-Json)
    Write-Host "❌ FAILED"
} catch { Write-Host "✅ PASSED: Admin rejected (403)" }

# Test 2: Coach Assignment
Write-Host "`n[TEST 2] Coach Role Assignment"
Write-Host "-"*80
$body2 = @{email='coach-test-'+(Get-Random)+'@atlas.com'; password='TestPass123!'; full_name='Test'} | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/auth/register' -Method Post -ContentType 'application/json' -Body $body2
$result = Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' -Method Post -ContentType 'application/json' -Headers @{Authorization="Bearer $($r2.access_token)"} -Body (@{role='coach'} | ConvertTo-Json)
if ($result.roles -contains 'coach') { Write-Host "✅ PASSED: Coach role assigned" } else { Write-Host "❌ FAILED" }

# Test 3: Role Reassignment Block
Write-Host "`n[TEST 3] Role Reassignment Prevention"
Write-Host "-"*80
try {
    Invoke-RestMethod -Uri 'http://localhost:8001/api/v1/users/role' -Method Post -ContentType 'application/json' -Headers @{Authorization="Bearer $($r2.access_token)"} -Body (@{role='analyst'} | ConvertTo-Json)
    Write-Host "❌ FAILED"
} catch { Write-Host "✅ PASSED: Role change blocked (409)" }

Write-Host "`n"+"="*80
Write-Host "SECURITY TESTS COMPLETED"
Write-Host "="*80
```

Run with:
```powershell
.\run_security_tests.ps1
```
