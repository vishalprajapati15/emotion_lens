# Emotion Lens

> A full-stack MERN application that performs AI-powered sentiment and emotion analysis on YouTube video comments. Paste any YouTube URL, and Emotion Lens fetches comments, classifies their sentiment and emotions using Hugging Face models, and generates an intelligent AI summary using Groq LLM.

---

## Features

- **YouTube Comment Analysis** — fetches up to 100 top-level comments from any public YouTube video
- **Sentiment Classification** — classifies each comment as POSITIVE, NEUTRAL, or NEGATIVE using `distilbert-base-uncased-finetuned-sst-2-english`
- **Emotion Detection** — detects 6 emotions (Joy, Anger, Sadness, Fear, Surprise, Disgust) using `j-hartmann/emotion-english-distilroberta-base`
- **AI Summary** — generates a structured analysis report (audience reaction, emotional trends, key concerns, creator insights) via Groq LLM
- **Dashboard** — paginated cards showing all previously analyzed videos per user
- **Video Detail View** — full analysis breakdown for any previously analyzed video
- **User Authentication** — JWT-based auth stored in HTTP-only cookies; register, login, logout, password reset via OTP email
- **Upsert Logic** — re-analyzing the same video updates existing records instead of creating duplicates
- **Summary Persistence** — generated AI summaries are stored and preserved across re-analyses
- **Email Notifications** — welcome email on registration and OTP email for password reset via Resend

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server & routing |
| `mongoose` | ^9.2.1 | MongoDB ODM |
| `@huggingface/inference` | ^4.13.12 | Sentiment & emotion ML models |
| `groq-sdk` | ^0.37.0 | Groq LLM for AI summary generation |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `cookie-parser` | ^1.4.7 | HTTP-only cookie parsing |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `resend` | ^6.9.2 | Transactional email (welcome + OTP) |
| `dotenv` | ^17.3.1 | Environment variable loading |
| `axios` | ^1.13.5 | HTTP client (YouTube Data API calls) |
| `nodemon` | ^3.1.11 | Dev auto-restart |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | DOM rendering |
| `react-router-dom` | ^7.13.0 | Client-side routing |
| `axios` | ^1.13.5 | API client |
| `tailwindcss` | ^4.1.18 | Utility-first CSS framework |
| `framer-motion` | ^12.34.1 | Animations & transitions |
| `recharts` | ^3.7.0 | Charts (sentiment & emotion visualizations) |
| `lucide-react` | ^0.574.0 | Icon library |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `vite` | ^7.3.1 | Build tool & dev server |

---

## Project Structure

```
Emotion Lens
├── Readme.md
│
├── backend/
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   │
│   ├── config/
│   │   ├── db.js                   # MongoDB connection (emotion_lense database)
│   │   ├── groq.js                 # Groq SDK client initialization
│   │   ├── huggingface.js          # HuggingFace InferenceClient + model names
│   │   ├── nodemailer.js           # Resend email sender helper
│   │   ├── emailTemplets.js        # HTML email templates (welcome, password reset)
│   │   └── youtube.js              # YouTube Data API URL builder
│   │
│   ├── controller/
│   │   ├── authController.js       # register, login, logout, me, send-reset-otp, reset-password
│   │   ├── userController.js       # getUserData (profile info)
│   │   ├── youtubeController.js    # getComments, getVideoMetaData, getVideoMetrics
│   │   ├── huggingfaceController.js# analyzeComments (sentiment + emotion, upsert to DB)
│   │   ├── groqController.js       # generateAnalysisSummary, generateSummaryById
│   │   └── videoController.js      # fetchCardData (paginated), fetchFullVideoDetails
│   │
│   ├── middleware/
│   │   └── userAuth.js             # JWT cookie verification, attaches req.userId
│   │
│   ├── model/
│   │   ├── userModel.js            # User schema (name, email, password, OTP fields)
│   │   ├── videoMetaDataModel.js   # Video metadata (title, channel, thumbnail, stats)
│   │   └── analysisModel.js        # Full analysis results (sentiment, emotion, summary)
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── userRoutes.js           # /api/user/*
│   │   ├── youtubeRoutes.js        # /api/youtube/*
│   │   ├── groqRoutes.js           # /api/groq/*
│   │   └── videoRoutes.js          # /api/videos/*
│   │
│   ├── services/
│   │   ├── youtubeService.js       # extractVideoId, getYoutubeComments, getYoutubeVideoDetails
│   │   ├── huggingfaceService.js   # analyzeSentiment, analyzeEmotion (batch processing)
│   │   ├── groqService.js          # generateTextFromGroq
│   │   └── videoService.js         # getCardPreviewData (paginated), getFullVideoAndAnalysisDetails
│   │
│   └── utils/
│       ├── groqPrompt.js           # Prompt builder for Groq LLM
│       └── cleanText.js            # HTML entity stripper for comment text + Groq output formatter
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    │
    └── src/
        ├── App.jsx                 # Root component, BrowserRouter, all routes
        ├── main.jsx                # ReactDOM.createRoot entry point
        ├── index.css               # Global styles
        │
        ├── assets/                 # Static images / SVGs
        │
        ├── context/
        │   └── Context.jsx         # AuthContext (user state, login, register, logout, refreshMe)
        │
        ├── hooks/
        │   └── useAuth.js          # Re-exports useAuth from Context
        │
        ├── pages/
        │   ├── Home.jsx            # Landing page (Hero, Feature, Pricing, Footer sections)
        │   ├── Login.jsx           # Login / Register toggle form
        │   ├── ResetPassword.jsx   # OTP-based password reset flow
        │   ├── Analysis.jsx        # Multi-stage YouTube analysis page
        │   ├── DashBoard.jsx       # Paginated video card grid for analyzed videos
        │   ├── VideoDetails.jsx    # Full analysis breakdown for a stored video
        │   └── ContactUs.jsx       # Contact form page
        │
        ├── components/
        │   ├── Navbar.jsx          # Responsive navbar with auth dropdown & dashboard link
        │   ├── Hero.jsx            # Hero section with CTA
        │   ├── Feature.jsx         # Feature highlights section
        │   ├── Pricing.jsx         # Pricing tiers section
        │   ├── Footer.jsx          # Site footer
        │   │
        │   └── videoDetails/       # Shared reusable analysis display components
        │       ├── VideoHero.jsx   # Video thumbnail, title, channel, publish date
        │       ├── SentimentStats.jsx  # Positive / Neutral / Negative stat cards
        │       ├── SentimentCharts.jsx # Pie + bar charts for sentiment & emotion
        │       ├── DominantCards.jsx   # Dominant sentiment & emotion highlight cards
        │       ├── AiSummary.jsx       # AI summary display with generate/regenerate button
        │       ├── VideoMetrics.jsx    # Views, likes, comments metrics
        │       ├── constants.js        # Shared config: SENTIMENT_CONFIG, EMOTION_CONFIG,
        │       │                       #   FETCH_STEPS, ANALYZE_STEPS, color maps
        │       └── helpers.js          # Shared helper utilities
        │
        └── services/
            ├── apiClient.js        # Axios instance (VITE_BACKEND_URL, withCredentials, 30s timeout)
            ├── authService.js      # login, register, logout, getMe, sendResetOtp, resetPassword
            ├── youtubeService.js   # fetchVideoMetaData, analyzeYouTubeVideo, fetchYouTubeComments
            └── videoService.js     # fetchVideoCards (paginated), fetchFullVideoDetails, generateSummary
```



## API Reference

All routes are prefixed with `/api`. Protected routes require a valid `token` cookie.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | No | `{ name, email, password }` | Register new user, set JWT cookie, send welcome email |
| POST | `/login` | No | `{ email, password }` | Login, set JWT cookie |
| POST | `/logout` | ✅ | — | Clear JWT cookie |
| GET | `/me` | ✅ | — | Return current authenticated user |
| POST | `/send-reset-otp` | No | `{ email }` | Send 6-digit OTP to email for password reset |
| POST | `/reset-password` | No | `{ email, otp, newPassword }` | Verify OTP and update password |

### User — `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/data` | ✅ | Return user profile data |

### YouTube — `/api/youtube`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/video-meta-data` | ✅ | `{ youtubeUrl }` | Fetch & upsert video metadata (title, channel, thumbnail, stats) |
| POST | `/analyze` | ✅ | `{ youtubeUrl }` | Run full sentiment + emotion analysis, upsert results |
| POST | `/get-comments` | ✅ | `{ youtubeUrl }` | Fetch raw comments only (no analysis) |
| POST | `/video-metrics` | ✅ | `{ youtubeUrl }` | Return video engagement metrics |

### Groq — `/api/groq`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/generate-summary` | ✅ | `{ youtubeUrl }` | Generate & store AI summary from URL |
| POST | `/generate-summary-by-id` | ✅ | `{ videoId }` | Generate & store AI summary from stored videoId |

### Videos — `/api/videos`

| Method | Endpoint | Auth | Query Params | Description |
|--------|----------|------|------|-------------|
| GET | `/cards` | ✅ | `page=1&limit=12` | Paginated dashboard cards (returns `totalVideos`, `page`, `limit`, `videos[]`) |
| GET | `/:videoId` | ✅ | — | Full analysis details for a specific video |

---

All metrics are computed server-side in `backend/controller/huggingfaceController.js` and `backend/controller/youtubeController.js`.

---

### 1. Sentiment / Emotion Percentage

For each label  (e.g. POSITIVE, NEUTRAL, NEGATIVE, joy, anger, …):

---

### 2. Satisfaction Score

Measures overall audience positivity on a scale of −100 to +100.

$$
\text{Satisfaction Score} = \text{Positive\%} - \text{Negative\%}
$$

> Positive values indicate a net-positive audience; negative values indicate net-negative reception.

---

### 3. Net Sentiment Score

Normalised sentiment balance in the range [−1, 1].

$$
\text{Net Sentiment Score} = \frac{\text{positiveCount} - \text{negativeCount}}{\text{totalComments}}
$$

> +1 means all comments are positive; −1 means all are negative; 0 means equal balance.

---

### 4. Positive Ratio

Ratio of positive comments to negative comments.

$$
\text{Positive Ratio} = \begin{cases} \text{positiveCount} & \text{if negativeCount} = 0;  \\ \dfrac{\text{positiveCount}}{\text{negativeCount}} & \text{otherwise} \end{cases}
$$

> A ratio > 1 means more positive than negative; a ratio of 5 means 5× more positive comments than negative.

---

### 5. Emotion Concentration

How concentrated audience emotion is around the single dominant emotion.

$$
\text{Concentration} = \frac{\text{dominantEmotionCount}}{\text{totalComments}}
$$

> Range [0, 1]. A value close to 1 means nearly all comments share the same dominant emotion.

---

### 6. Negative Risk Index

A composite risk score combining the proportion of negative sentiment with the intensity of hostile emotions (anger + disgust).

$$
\text{Negative Risk Index} = \frac{\text{Negative\%}}{100} \times \frac{\text{angerCount} + \text{disgustCount}}{100}
$$

> A higher value signals that not only is negative sentiment prevalent, but it is also driven by the most hostile emotion categories.

---

### Summary of Metric Ranges

| Metric | Range | Ideal (creator) |
|--------|-------|-----------------|
| Sentiment Percentage | 0 – 100% per label | High POSITIVE% |
| Satisfaction Score | −100 to +100 | > 0 |
| Net Sentiment Score | −1 to +1 | Close to +1 |
| Positive Ratio | 0 to ∞ | > 1 |
| Emotion Concentration | 0 to 1 | Low (diverse positive emotions) |
| Negative Risk Index | 0 to 1 | Close to 0 |

---

## Environment Variables

### Backend — `backend/.env`

```env

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb_uri
JWT_SECRET_KEY=your_jwt_secret_key
YOUTUBE_API_KEY=your_youtube_data_api_key
HUGGING_FACE_TOKEN=hf_your_token_here
GROQ_API_KEY=gsk_your_groq_api_key
RESEND_API_KEY=re_your_resend_api_key
```

### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/emotion-lens.git
cd emotion-lens
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` with all variables listed above, then:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Then:

```bash
npm run dev
```

## HuggingFace Models Used

| Task | Model |
|------|-------|
| Sentiment Analysis | [`distilbert-base-uncased-finetuned-sst-2-english`](https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english) |
| Emotion Detection | [`j-hartmann/emotion-english-distilroberta-base`](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base) |

Both models are called via the `@huggingface/inference` SDK using `textClassification`. Comments are processed in batches of 32 with a 1800-character truncation limit per comment to stay within the 512-token model limit.

---

## Author

**Vishal Prajapati**
