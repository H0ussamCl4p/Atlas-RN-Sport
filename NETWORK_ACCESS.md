# Network Access Configuration Guide

## 🌐 Your Network Addresses

Based on your network configuration, Atlas is accessible at:

### Frontend (Vite):
- **Local:** http://localhost:5173/
- **Network 1:** http://10.33.212.190:5173/
- **Network 2:** http://192.168.56.1:5173/
- **Network 3:** http://192.168.137.1:5173/
- **Network 4:** http://172.22.224.1:5173/

### Backend (FastAPI):
- **Local:** http://localhost:8001/
- **Network 1:** http://10.33.212.190:8001/
- **Network 2:** http://192.168.56.1:8001/
- **Network 3:** http://192.168.137.1:8001/
- **Network 4:** http://172.22.224.1:8001/

---

## 🔧 What Was Changed

### 1. Vite Configuration (`vite.config.ts`)
```typescript
server: {
  host: "0.0.0.0", // Changed from "localhost"
  port: 5173,
}
```

### 2. CORS Configuration (`backend/auth_service/app/core/config.py`)
Added network IPs to allowed origins:
```python
CORS_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://10.33.212.190:5173",
    "http://192.168.56.1:5173",
    "http://192.168.137.1:5173",
    "http://172.22.224.1:5173",
]
```

---

## 🔥 Windows Firewall Configuration

You may need to allow connections through Windows Firewall:

### Quick Fix (PowerShell as Administrator):

```powershell
# Allow Vite dev server (port 5173)
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow

# Allow FastAPI backend (port 8001)
New-NetFirewallRule -DisplayName "Atlas Backend API" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow
```

### Or use GUI:
1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Next
4. Select **TCP**, enter port **5173** → Next
5. Select **Allow the connection** → Next
6. Check all profiles (Domain, Private, Public) → Next
7. Name it "Vite Dev Server" → Finish
8. Repeat for port **8001** (Atlas Backend)

---

## 📱 Connecting from Another Device

### Step 1: Find the Correct IP
Your PC has multiple network interfaces:
- **10.33.212.190** — Likely your main WiFi/Ethernet
- **192.168.56.1** — VirtualBox Host-Only Network
- **192.168.137.1** — Windows Hotspot/Mobile Hotspot
- **172.22.224.1** — WSL/Docker network

**Use the IP that matches your network:**
- If both devices are on WiFi → Use **10.33.212.190**
- If using Windows Hotspot → Use **192.168.137.1**
- If using VirtualBox network → Use **192.168.56.1**

### Step 2: Access from Other Device
On your phone/tablet/other PC:

1. **Open browser**
2. **Navigate to:** `http://10.33.212.190:5173/` (replace with your IP)
3. **Done!** The app should load

---

## 🧪 Testing Network Access

### From your PC (PowerShell):
```powershell
# Test frontend
curl http://10.33.212.190:5173

# Test backend
curl http://10.33.212.190:8001/api/v1/health
```

### From another device:
Open browser and test:
- Frontend: http://10.33.212.190:5173/
- Backend health: http://10.33.212.190:8001/api/v1/health

---

## 🐛 Troubleshooting

### Issue: "Connection timed out"
**Solution:**
1. Check Windows Firewall (see above)
2. Verify both servers are running:
   - Frontend: `npm run dev` (should show Network URLs)
   - Backend: `python backend/auth_service/app/main.py`

### Issue: "CORS error in console"
**Solution:**
- Backend must be restarted after CORS changes
- Check that the IP you're using is in `CORS_ORIGINS`

### Issue: "Wrong IP address"
**Solution:**
1. Run: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Find your network adapter's IPv4 address
3. Update `CORS_ORIGINS` in `backend/auth_service/app/core/config.py`
4. Restart backend

### Issue: "Can't access from phone but works on PC"
**Solution:**
- Ensure phone is on the **same WiFi network**
- Check if Windows Firewall is blocking
- Try disabling Windows Firewall temporarily to test

---

## 🎯 Quick Start Commands

### Restart Everything (to apply changes):

```powershell
# Terminal 1 - Backend
cd backend/auth_service
python app/main.py

# Terminal 2 - Frontend
npm run dev
```

Look for output showing Network addresses:
```
➜  Local:   http://localhost:5173/
➜  Network: http://10.33.212.190:5173/  ← Use this!
```

---

## 📋 Checklist

- ✅ Vite configured with `host: "0.0.0.0"`
- ✅ Backend configured with `HOST = "0.0.0.0"`
- ✅ CORS origins updated with network IPs
- ⚠️ Windows Firewall rules (you may need to add)
- ⚠️ Both devices on same network

---

## 🚀 Production Notes

**For production deployment:**
- Use proper domain names instead of IPs
- Configure HTTPS/SSL certificates
- Use environment variables for CORS origins
- Remove development origins (localhost)
- Consider using nginx as reverse proxy

---

## 📞 Need Help?

**Common network IPs by scenario:**
- **Home WiFi:** Usually 192.168.1.x or 192.168.0.x or 10.0.0.x
- **Office/School:** Often 10.x.x.x or 172.16.x.x
- **Mobile Hotspot:** Usually 192.168.137.1 (Windows) or 172.20.10.1 (iPhone)

**To find your real WiFi IP:**
```powershell
ipconfig | Select-String "IPv4" -Context 2,0 | Select-String "Wireless"
```

---

**Updated:** January 3, 2026  
**Status:** ✅ Configured for network access
