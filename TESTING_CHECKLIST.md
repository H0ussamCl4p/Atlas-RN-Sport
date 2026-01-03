# ✅ Pre-Demo Testing Checklist

## Before Demo Day

Use this checklist to verify everything works perfectly.

---

## 🚀 Environment Setup

- [ ] **Backend Dependencies Installed**
  ```bash
  cd backend/auth_service
  pip install -r requirements.txt
  ```

- [ ] **Frontend Dependencies Installed**
  ```bash
  npm install
  ```

- [ ] **Environment Variables Set**
  - [ ] `backend/auth_service/.env` exists
  - [ ] `DATABASE_URL` configured
  - [ ] `SECRET_KEY` set (can be any string for demo)

- [ ] **Database Initialized**
  ```bash
  cd backend/shared
  python init_db.py
  ```

---

## 🧪 Functional Testing

### Test 1: Backend Health Check

- [ ] Backend starts without errors
  ```bash
  cd backend/auth_service
  python app/main.py
  ```

- [ ] Health endpoint responds
  - Open: http://localhost:8001/api/v1/health
  - Expected: `{"status": "healthy"}`

- [ ] API docs accessible
  - Open: http://localhost:8001/docs
  - Should see Swagger UI

---

### Test 2: Frontend Build

- [ ] Frontend starts without errors
  ```bash
  npm run dev
  ```

- [ ] No TypeScript errors in terminal
- [ ] Opens on http://localhost:5173

---

### Test 3: Login Flow ⭐

- [ ] Navigate to http://localhost:5173/login
- [ ] See professional login page
- [ ] Email field pre-filled: `demo@atlas.ai`
- [ ] Password field pre-filled: `Demo123!`
- [ ] Demo notice visible
- [ ] Click "Se connecter"
- [ ] See loading spinner
- [ ] Redirect to dashboard (usually `/`)
- [ ] No console errors in browser DevTools

**If this test passes, you're 90% ready for demo!**

---

### Test 4: Dashboard After Login

- [ ] Dashboard loads successfully
- [ ] Sidebar shows user email (`demo@atlas.ai`)
- [ ] Logout button visible in sidebar
- [ ] No authentication errors in console
- [ ] All navigation links work

---

### Test 5: Session Persistence

- [ ] After logging in, press F5 (refresh page)
- [ ] Still logged in (don't get redirected to login)
- [ ] User email still shows in sidebar
- [ ] Dashboard still works

---

### Test 6: Logout Flow

- [ ] Click "Déconnexion" button in sidebar
- [ ] Redirect to login page
- [ ] Email/password fields empty or show defaults
- [ ] Try navigating to http://localhost:5173/
- [ ] Should redirect back to login

---

### Test 7: Route Protection

- [ ] Log out completely
- [ ] Try accessing http://localhost:5173/upload
- [ ] Should redirect to login
- [ ] Try accessing http://localhost:5173/analyses
- [ ] Should redirect to login
- [ ] Try accessing http://localhost:5173/settings
- [ ] Should redirect to login

**If redirected every time, route protection works! ✅**

---

### Test 8: Token Refresh (Advanced)

This is hard to test without waiting, but verify setup:

- [ ] Browser DevTools → Application → Local Storage
- [ ] See `atlas_refresh_token` key
- [ ] Value is a JWT string (long, with dots)

**The refresh logic is automatic. If login works, refresh works.**

---

## 🎨 Visual Quality Check

### Login Page

- [ ] Logo/shield icon displays properly
- [ ] "Atlas" title visible
- [ ] Card has proper shadow/border
- [ ] Input fields have proper styling
- [ ] Button has glow effect on hover
- [ ] Demo notice has info icon
- [ ] Footer text readable
- [ ] No layout breaks on different window sizes

### Dashboard

- [ ] Sidebar looks good
- [ ] User email displays correctly
- [ ] Logout button styled consistently
- [ ] Main content area not covered by sidebar
- [ ] All icons render properly

---

## 🐛 Error Handling

### Test Invalid Credentials

- [ ] Log out
- [ ] Enter wrong email: `wrong@example.com`
- [ ] Enter wrong password: `wrongpassword`
- [ ] Click "Se connecter"
- [ ] See error message (red alert)
- [ ] Error is user-friendly
- [ ] Can try again without page refresh

---

### Test Network Error

- [ ] Stop backend server
- [ ] Try to log in
- [ ] See network error message
- [ ] Message says connection failed or similar
- [ ] No app crash

---

## 🎬 Demo Day Rehearsal

### Run Through Full Flow (2 minutes)

1. [ ] Open http://localhost:5173/login
2. [ ] Show pre-filled credentials
3. [ ] Mention this is for judges
4. [ ] Click "Se connecter"
5. [ ] Show dashboard loads
6. [ ] Show user email in sidebar
7. [ ] Refresh page (F5)
8. [ ] Show still logged in
9. [ ] Click logout
10. [ ] Show redirect to login

**Time yourself. Should be ~15-20 seconds.**

---

## 📱 Browser Compatibility

Test in at least 2 browsers:

- [ ] **Chrome/Edge** - Primary browser
  - [ ] Login works
  - [ ] Dashboard works
  - [ ] No console errors

- [ ] **Firefox** - Backup browser
  - [ ] Login works
  - [ ] Dashboard works
  - [ ] No console errors

---

## 🚨 Emergency Backup

If something breaks during demo:

### Fallback Plan A: Use Screenshots
- [ ] Take screenshot of login page
- [ ] Take screenshot of dashboard
- [ ] Take screenshot of logout button
- [ ] "Here's what it looks like when working..."

### Fallback Plan B: Show Code
- [ ] Open `src/pages/Login.tsx` in VS Code
- [ ] Explain the implementation
- [ ] Show `src/services/api.ts` for token management

### Fallback Plan C: Show Documentation
- [ ] Open `AUTHENTICATION.md`
- [ ] Walk through architecture
- [ ] Show flow diagrams

---

## 🎯 Success Criteria

**Your demo is READY when:**

- ✅ Login page loads with pre-filled credentials
- ✅ Clicking login redirects to dashboard
- ✅ User email shows in sidebar
- ✅ Page refresh keeps you logged in
- ✅ Logout button works
- ✅ Routes are protected (redirect to login)
- ✅ No console errors during normal flow
- ✅ Visual design matches Atlas theme

**If all above pass, you're DEMO-READY! 🎉**

---

## 📞 Last-Minute Issues?

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check .env file exists
ls -la .env  # or dir .env on Windows
```

### Frontend won't start
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Try different port
npm run dev -- --port 3000
```

### Login doesn't work
```bash
# Check backend is running
curl http://localhost:8001/api/v1/health

# Check CORS in backend
# Should allow http://localhost:5173
```

### Browser console errors
- Open DevTools (F12)
- Check Console tab
- Look for red errors
- Google the error message
- Check Network tab for failed requests

---

## ✨ Confidence Boosters

**Before you go on stage:**

1. ✅ Run through checklist one more time
2. ✅ Close all unnecessary browser tabs
3. ✅ Close all unnecessary applications
4. ✅ Have backend running in one terminal
5. ✅ Have frontend running in another terminal
6. ✅ Have login page open in browser
7. ✅ Take a deep breath
8. ✅ You've got this! 🚀

---

**When everything on this checklist passes, you're DEMO-READY! 🏆**

Print this checklist and check items as you test!
