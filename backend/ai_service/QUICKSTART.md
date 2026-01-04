# AI Service - Quick Start Checklist

## ⚡ Get Your MVP Running in 15 Minutes

### Step 1: Install Dependencies (5 min)

```bash
cd Atlas-RN-Sport/backend/ai_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment (3 min)

```bash
copy .env.example .env
```

Edit `.env` and set these 3 critical values:

```env
ROBOFLOW_API_KEY=your_key_from_roboflow_com
JWT_SECRET_KEY=same_as_auth_service
DATABASE_URL=postgresql://user:pass@localhost:5432/atlas_db
```

### Step 3: Copy Model (1 min)

```bash
copy ..\..\..\EGNN_model.pth models\best_model.pth
```

Or if you don't have a trained model yet, skip this (service will run with untrained model).

### Step 4: Verify video_processor.py (30 sec)

Check that this file exists:

```
football_tactical_analysis\video_processor.py
```

If it doesn't exist, the service won't be able to process videos.

### Step 5: Start the Service (30 sec)

```bash
run.bat
```

You should see:

```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8002
```

### Step 6: Test It Works (2 min)

Open http://localhost:8002/docs in your browser.

You should see the Swagger UI with endpoints:

- `POST /api/v1/videos/upload`
- `POST /api/v1/analyses/`
- `GET /api/v1/videos/`
- `GET /health`

### Step 7: Upload First Video (3 min)

1. Get JWT token from auth service (port 8001):

   ```bash
   curl -X POST http://localhost:8001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"your@email.com\",\"password\":\"password\"}"
   ```

2. Copy the `access_token` from response

3. In Swagger UI (http://localhost:8002/docs):
   - Click "Authorize" button (top right)
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"
   - Try `POST /api/v1/videos/upload`

---

## ✅ Verification Checklist

- [ ] Dependencies installed without errors
- [ ] `.env` file created with all 3 required values
- [ ] Model file copied to `models/best_model.pth` (optional)
- [ ] `video_processor.py` exists in parent directory
- [ ] Service starts on port 8002
- [ ] http://localhost:8002/docs loads successfully
- [ ] Health check returns `{"status":"healthy"}`
- [ ] Can upload video with JWT token

---

## 🚨 Quick Troubleshooting

### "ModuleNotFoundError: No module named 'supervision'"

```bash
pip install supervision>=0.20.0 --no-deps
```

### "ModuleNotFoundError: No module named 'video_processor'"

Check that `video_processor.py` exists at:

```
C:\Users\Salwa Khattami\Coding_stuff\football_tactical_analysis\video_processor.py
```

### "ROBOFLOW_API_KEY not set"

1. Go to https://app.roboflow.com/
2. Sign in
3. Go to Settings → API Keys
4. Copy your key
5. Paste in `.env` file

### "Database connection failed"

Verify:

- PostgreSQL is running
- Database `atlas_db` exists
- Connection string in `.env` is correct

### "Unauthorized" errors

Verify:

- JWT_SECRET_KEY matches auth_service
- Token is not expired
- Using format: `Bearer <token>`

---

## 📚 What's Next?

Once your MVP is running:

1. **Test video processing**:

   - Upload a short football video
   - Create analysis request
   - Poll until status = 'completed'
   - View results in `output_data`

2. **Integrate with frontend**:

   - Create `src/services/ai.ts`
   - Add upload component
   - Add analysis results display
   - See [SETUP.md](SETUP.md#integration-with-frontend) for code examples

3. **Deploy to production**:
   - Use production database
   - Set `DEBUG=False` in `.env`
   - Run with multiple workers: `uvicorn app.main:app --workers 4`

---

## 📖 Documentation

- **Full setup guide**: [SETUP.md](SETUP.md)
- **Implementation details**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **API docs**: http://localhost:8002/docs

---

## 🎯 Success Criteria

Your MVP is complete when:

✅ AI service runs on port 8002  
✅ Auth service runs on port 8001  
✅ Frontend runs on port 5173  
✅ Can upload video from frontend  
✅ Analysis processes in background  
✅ Results display in frontend

**You're building a complete football tactical analysis platform! 🚀⚽**
