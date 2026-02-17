# Emotion Lens - YouTube Comment Analysis Backend

A powerful backend service that analyzes YouTube comments using AI to extract sentiment and emotional insights. Built with Node.js, Express, and integrated with Hugging Face AI models.

## 🚀 Features

- **User Authentication System**
  - Secure registration and login with JWT tokens
  - Password encryption using bcrypt
  - OTP-based password reset
  - Email notifications via Resend
  
- **YouTube Comment Analysis**
  - Fetch up to 100 comments from any YouTube video
  - Clean and preprocess comments (remove URLs, emojis, HTML)
  - AI-powered sentiment analysis (Positive/Negative)
  - AI-powered emotion detection (Joy, Sadness, Anger, Fear, Surprise, etc.)
  - Statistical aggregation with percentages
  - Identify dominant sentiment and emotion

- **Secure API**
  - Protected routes with JWT authentication
  - httpOnly cookies for token storage
  - CORS enabled for frontend integration

## 🛠️ Tech Stack

### Backend Framework
- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web application framework

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v9.2.1) - MongoDB ODM

### Authentication & Security
- **JWT (jsonwebtoken v9.0.3)** - Token-based authentication
- **bcryptjs (v3.0.3)** - Password hashing
- **cookie-parser (v1.4.7)** - Cookie parsing middleware
- **CORS (v2.8.6)** - Cross-origin resource sharing

### AI & ML Integration
- **@huggingface/inference** - Hugging Face AI models client
  - Sentiment Analysis Model: `distilbert-base-uncased-finetuned-sst-2-english`
  - Emotion Detection Model: `j-hartmann/emotion-english-distilroberta-base`

### External APIs
- **YouTube Data API v3** - Fetch video comments
- **Hugging Face Inference API** - AI model inference
- **Resend API (v6.9.2)** - Email delivery service

### Utilities
- **axios (v1.13.5)** - HTTP client
- **dotenv (v17.3.1)** - Environment variable management
- **nodemon (v3.1.11)** - Development auto-reload

## 📁 Project Structure

```
├── config/
│   ├── db.js                  # MongoDB connection
│   ├── huggingface.js         # Hugging Face client setup
│   ├── youtube.js             # YouTube API configuration
│   ├── nodemailer.js          # Email service
│   └── emailTemplets.js       # HTML email templates
├── controller/
│   ├── authController.js      # Authentication logic
│   ├── userController.js      # User data operations
│   └── youtubeController.js   # YouTube analysis logic
├── middleware/
│   └── userAuth.js            # JWT authentication middleware
├── model/
│   └── userModel.js           # User schema
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── userRoutes.js          # User endpoints
│   └── youtubeRoutes.js       # YouTube analysis endpoints
├── services/
│   ├── huggingfaceService.js  # AI model service
│   └── youtubeService.js      # YouTube API service
├── utils/
│   └── cleanText.js           # Text preprocessing utilities
├── server.js                  # Application entry point
└── package.json               # Dependencies
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance
- YouTube Data API key
- Hugging Face API token
- Resend API key

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET_KEY=your_jwt_secret_key
HUGGING_FACE_TOKEN=your_huggingface_token
YOUTUBE_API_KEY=your_youtube_api_key
RESEND_API_KEY=your_resend_api_key
NODE_ENV=development
```

### Install Dependencies

```bash
npm install
```

### Run the Server

```bash
npm start
```

Server will run on `http://localhost:4001` (or your configured PORT)

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:** JWT token in httpOnly cookie

#### Login
- **POST** `/api/auth/login`
- **Body:** `{ "email": "string", "password": "string" }`
- **Response:** JWT token in httpOnly cookie

#### Logout
- **POST** `/api/auth/logout`
- **Response:** Clears authentication cookie

#### Send Reset OTP
- **POST** `/api/auth/send-reset-otp`
- **Body:** `{ "email": "string" }`
- **Response:** OTP sent to email (valid for 15 minutes)

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body:** `{ "email": "string", "otp": "string", "newPassword": "string" }`
- **Response:** Password updated

### User Routes (`/api/user`) 🔒 Protected

#### Get User Data
- **GET** `/api/user/data`
- **Headers:** Cookie with JWT token
- **Response:** User information

### YouTube Analysis Routes (`/api/youtube`) 🔒 Protected

#### Get Comments
- **POST** `/api/youtube/get-comments`
- **Body:** `{ "youtubeUrl": "string" }`
- **Response:** Array of cleaned comments

#### Analyze Comments
- **POST** `/api/youtube/analyze`
- **Body:** `{ "youtubeUrl": "string" }`
- **Response:**
```json
{
  "success": true,
  "videoId": "video_id",
  "totalComments": 100,
  "statistics": {
    "totalComments": 100,
    "sentiment": {
      "POSITIVE": { "count": 60, "percentage": "60.00" },
      "NEGATIVE": { "count": 40, "percentage": "40.00" }
    },
    "emotion": {
      "joy": { "count": 45, "percentage": "45.00" },
      "sadness": { "count": 20, "percentage": "20.00" },
      "anger": { "count": 15, "percentage": "15.00" },
      "neutral": { "count": 20, "percentage": "20.00" }
    }
  },
  "dominantSentiment": { "label": "POSITIVE", "count": 60 },
  "dominantEmotion": { "label": "joy", "count": 45 },
  "message": "Comments analyzed successfully!!"
}
```

## 🧠 AI Models Used

### Sentiment Analysis
- **Model:** `distilbert-base-uncased-finetuned-sst-2-english`
- **Task:** Binary sentiment classification (Positive/Negative)
- **Accuracy:** High accuracy on English text

### Emotion Detection
- **Model:** `j-hartmann/emotion-english-distilroberta-base`
- **Task:** Multi-class emotion classification
- **Emotions:** Joy, Sadness, Anger, Fear, Surprise, Disgust, Neutral

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in httpOnly cookies (prevent XSS)
- Cookies secured in production (HTTPS only)
- SameSite cookie policy
- Protected routes with authentication middleware
- OTP expiration after 15 minutes

## 🧹 Text Preprocessing

Comments are cleaned before analysis:
- Remove HTML tags
- Remove URLs
- Remove emojis
- Keep only English and Hindi text
- Remove extra whitespace
- Filter empty comments

## 📊 Comment Analysis Limits

- Default: 100 comments per video (YouTube API limit)
- Configurable in `config/youtube.js`
- API quota depends on your YouTube API key


## 📝 Author

**Vishal Prajapati**
