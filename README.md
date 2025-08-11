# 🖌️ Chalk Shapian

Chalk Shapian is a community platform for chalk carvers to showcase their creations, view others' work, and engage in discussions.  
The platform is currently being rebuilt with the MERN stack for improved performance and user experience.

## 🚀 Features
- **Showcase Creations**: Upload and display chalk carvings.
- **Explore Community Work**: View other users' chalk art.
- **Interactive Discussions**: Engage in meaningful conversations.
- **Image Upload with Cloudinary**: Efficient and secure image hosting.
- **Upcoming**: Group chat feature for enhanced interaction.

## 🛠️ Tech Stack
**Frontend**: React.js, CSS3  
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Image Hosting**: Cloudinary

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or above)
- npm or yarn
- MongoDB instance
- Cloudinary account

### Installation
1. **Clone the repository**  
```bash
git clone https://github.com/SomendraZ/ChalkShapian_Updated.git
cd ChalkShapian_Updated
```

2. **Install dependencies for both frontend and backend**  
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**  
Create `.env` files in both `backend` and `frontend` directories with the following:
```
# ===== Backend (.env) =====
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
MONGO_URI=mongodb+srv://username:password@clustername.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:3000
```
```
# ===== Frontend (.env) =====
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=ml_default
REACT_APP_SERVER=http://localhost:5000

```

4. **Run the development servers**  
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```

5. **Access the app**  
Open your browser and navigate to:  
```
http://localhost:3000
```

## 📌 Roadmap
- ✅ Core image upload & display functionality
- 🔄 Backend rebuild using MERN stack
- 💬 Group chat & real-time interactions
- ❤️ Like, Share and Discuss features for favorite artworks
