# ZCoder

A interactive coding community platform to practise and scale up your skills.

## Run Locally
### First clone the repo
```bash
git clone https://github.com/Abhiram44440/Zcoder_.git
cd ZCoder
```

### Run backend.
```bash
cd backend
npm i 
nodemon index.js
```

Create a `.env` file in the backend folder with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/zcoder
PORT=3000
JWT_SECRET=your_jwt_secret_key
(above jwt key can be found in terminal by this command < node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">)
```

### Run frontend
Then open a new terminal and
```bash
cd frontend
npm i
npm run dev
```

Create a `.env` file in the frontend folder with the following variables:
```
VITE_API_URL = https://alfa-leetcode-api.onrender.com
VITE_BACKEND_URL = http://localhost:3000
VITE_JUDGE = https://emkc.org/api/v2/piston/execute
```

Then visit http://localhost:5173/
