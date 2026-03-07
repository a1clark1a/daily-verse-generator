# Daily Verse Generator

A beautiful, tranquil web application that generates inspirational Bible verses as shareable images. Built with Next.js and Firebase, this app creates stunning verse cards with gradient backgrounds, custom fonts, and decorative icons.

![Daily Verse Banner](./src/assets/tranquil.png)

## Features

- **Daily Inspirational Banner**: Beautiful nature images that change daily, powered by Unsplash API
- **Random Bible Verse Generation**: Fetches random Bible verses from multiple translations
- **Beautiful Image Generation**: Creates aesthetically pleasing verse cards with:
  - Dark gradient backgrounds
  - Custom EB Garamond font rendering
  - Decorative FontAwesome icons
  - Responsive text wrapping
- **Multiple Bible Translations**: Support for 7 different Bible translations:
  - KJV (King James Version)
  - WEB (World English Bible)
  - ASV (American Standard Version)
  - BBE (Bible in Basic English)
  - Darby
  - YLT (Young's Literal Translation)
  - OEB-US (Open English Bible)
- **Social Sharing**: Share generated verses directly to:
  - Facebook
  - Twitter
  - Instagram
  - Native device sharing (mobile)
- **Dark/Light Mode**: Toggle between light and dark themes with custom "tranquil" color palette
- **Download Capability**: Save generated verse images locally
- **Real-time Analytics**: Track total verses generated with Firebase Analytics
- **Rate Limiting**: IP-based rate limiting to prevent abuse
- **Responsive Design**: Fully responsive UI that works on all devices

## Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **UI Library**: [Chakra UI v3](https://chakra-ui.com/)
- **Styling**: Custom Chakra UI theme with tranquil color palette and light/dark mode support
- **Fonts**: Google Fonts (Permanent Marker, Caveat) via Next.js font optimization
- **State Management**: React Context API for Bible translation selection
- **Image Handling**: Next.js Image optimization with remote pattern support for Unsplash
- **External APIs**: Unsplash API for daily banner images
- **Icons**: React Icons (FontAwesome, HeroIcons)
- **TypeScript**: Full type safety throughout the application

### Backend (Firebase Functions)

- **Runtime**: Node.js 22
- **Framework**: Firebase Functions v2 (HTTP functions)
- **Admin SDK**: Firebase Admin SDK for Firestore operations
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) for SVG compositing and PNG generation
- **Font Rendering**: EB Garamond font embedded as base64 in SVG
- **Icon Rendering**: FontAwesome SVG icons (@fortawesome/fontawesome-svg-core)
- **HTTP Client**: Axios for Bible API requests
- **CORS**: Enabled for cross-origin requests

### Infrastructure

- **Hosting**: Firebase Hosting / Vercel compatible
- **Functions**: Firebase Cloud Functions (Google Cloud Run)
- **Database**: Cloud Firestore
  - Verse count statistics
  - Rate limiting data
- **Analytics**: Firebase Analytics

## Architecture

### System Overview

```
┌─────────────────────────────┐
│      Next.js App            │
│      (Frontend)             │
└──────┬──────────────┬───────┘
       │              │
       │              │ Daily Banner
       │              │ (Server Side)
       │              ▼
       │         ┌──────────┐
       │         │ Unsplash │
       │         │   API    │
       │         └──────────┘
       │
       │ Server Actions
       │
       ▼
┌─────────────────────────┐
│  Firebase Cloud         │
│  Functions (Backend)    │
│                         │
│  • generateVerseImage   │
│  • getVerseCount        │
└────────┬────────────────┘
         │
         ├──────────┬────────────┬─────────────┐
         ▼          ▼            ▼             ▼
    ┌────────┐ ┌────────┐  ┌─────────┐  ┌──────────┐
    │ Bible  │ │ Sharp  │  │Firestore│  │Analytics │
    │  API   │ │(Image) │  │   DB    │  │          │
    └────────┘ └────────┘  └─────────┘  └──────────┘
```

### Frontend Architecture

**Component Structure:**

- `app/page.tsx` - Main page with SSR for verse count and daily banner image
- `app/layout.tsx` - Root layout with font configuration, providers, and metadata
- `app/actions.ts` - Server actions (verse generation, verse count, Unsplash API)
- `app/theme.tsx` - Chakra UI theme with color tokens and background gradients
- `app/globals.css` - Global CSS and Google Font imports
- `contexts/TranslationContext.tsx` - Global state for Bible translation selection
- `components/verseGenerator/` - Verse generator UI (Header, Generator, Elements)
- `components/googleAnalytics/` - Firebase Analytics integration
- `components/ui/` - Reusable UI components (color-mode, select, toaster, etc.)

**Data Flow:**

**Daily Banner:**

1. Page loads (server-side)
2. `getDailyImage()` action fetches image from Unsplash API
3. Uses day of year to deterministically select same image for 24 hours
4. Falls back to static image if API fails
5. Image is cached for 24 hours with Next.js revalidation

**Verse Generation:**

1. User clicks "Generate Verse" button
2. `VerseGenerator.tsx` calls `generateVerseAction` server action
3. Server action sends POST request to Firebase Cloud Function
4. Cloud Function returns base64-encoded image
5. Image is displayed in a modal dialog with sharing options

### Backend Architecture

**Firebase Cloud Functions:**

#### `generateVerseImage`

- **HTTP Trigger**: POST endpoint
- **Memory**: 1 GiB
- **Timeout**: 60 seconds
- **Max Instances**: 20

**Processing Pipeline:**

1. Rate limiting check (20 requests per IP per minute)
2. Fetch random verse from Bible API (`https://bible-api.com`)
3. Generate random dark gradient background (SVG)
4. Select random decorative icon from FontAwesome library
5. Create text overlay SVG with:
   - Verse reference (book, chapter, verse)
   - Verse text with intelligent line wrapping
   - Translation name
6. Composite layers using Sharp:
   - Background gradient
   - Decorative icon (top-right)
   - Text overlay (centered)
7. Convert to PNG and encode as base64
8. Increment verse counter in Firestore
9. Return image as data URL

#### `getVerseCount`

- **HTTP Trigger**: GET endpoint
- **Max Instances**: 50
- **Purpose**: Returns total verses generated
- **Caching**: Next.js revalidates every 60 seconds

**Database Schema:**

```
Firestore Collections:
├── stats/
│   └── verse
│       └── count: number
└── rateLimits/
    └── [ip-address]
        ├── count: number
        └── timestamp: number
```

## API Usage

### External APIs

**Bible API**

- **Provider**: [Bible-API.com](https://bible-api.com)
- **Endpoint**: `https://bible-api.com/data/{translation}/random`
- **Translations Supported**: kjv, web, asv, bbe, darby, ylt, oeb-us
- **Response Format**:
  ```json
  {
    "random_verse": {
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world..."
    },
    "translation": {
      "name": "King James Version"
    }
  }
  ```

**Unsplash API**

- **Provider**: [Unsplash](https://unsplash.com/developers)
- **Endpoint**: `https://api.unsplash.com/search/photos`
- **Purpose**: Daily rotating banner images with nature/peaceful themes
- **Features**:
  - Deterministic daily image selection using day of year
  - 24-hour server-side caching with Next.js revalidation
  - Automatic photographer attribution
  - Fallback to static image if API unavailable
- **Query Parameters**:
  - `query=nature peaceful landscape` - Search terms
  - `orientation=landscape` - Image orientation
  - `per_page=30` - Number of results to fetch
  - `client_id={access_key}` - API authentication
- **Response Format**:
  ```json
  {
    "results": [
      {
        "urls": {
          "regular": "https://images.unsplash.com/photo-..."
        },
        "alt_description": "Mountain landscape",
        "user": {
          "name": "Photographer Name",
          "links": {
            "html": "https://unsplash.com/@photographer"
          }
        }
      }
    ]
  }
  ```

### Internal API Endpoints

**Generate Verse Image**

- **URL**: `{GENERATE_VERSE_URL}` (Cloud Function URL)
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "translation": "kjv"
  }
  ```
- **Response**:
  ```json
  {
    "imageUrl": "data:image/png;base64,iVBORw0KGg..."
  }
  ```
- **Error Responses**:
  - `429 Too Many Requests` - Rate limit exceeded
  - `500 Internal Server Error` - Failed to generate image

**Get Verse Count**

- **URL**: `{GET_VERSE_COUNT_URL}` (Cloud Function URL)
- **Method**: GET
- **Response**:
  ```json
  {
    "count": 12345,
    "timestamp": "2025-11-01T00:00:00.000Z"
  }
  ```

## Environment Variables

### Frontend (.env.local)

```bash
# Firebase Cloud Function URLs
GENERATE_VERSE_URL=https://your-function-url.cloudfunctions.net/generateVerseImage
GET_VERSE_COUNT_URL=https://your-function-url.cloudfunctions.net/getVerseCount

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Unsplash API - Get your free access key at https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

### Backend (Firebase Functions)

Firebase Functions automatically inherit project configuration. No additional environment variables needed - they access Firestore and other Firebase services through the Admin SDK.

## Setup and Installation

### Prerequisites

- Node.js 18+ (for frontend)
- Node.js 22 (for Firebase functions)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with:
  - Cloud Functions enabled
  - Firestore database created
  - Firebase Analytics enabled (optional)

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd daily-verse-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. **Get Unsplash API Key** (Optional - for daily banner images)
   - Go to [Unsplash Developers](https://unsplash.com/developers)
   - Create a free account and register a new application
   - Copy your Access Key
   - Add it to `.env.local` as `UNSPLASH_ACCESS_KEY`
   - **Note**: The app will use a static fallback image if this key is not provided

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Firebase Functions Setup

1. **Navigate to functions directory**

   ```bash
   cd functions
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Login to Firebase**

   ```bash
   firebase login
   ```

4. **Initialize Firebase project** (if not already done)

   ```bash
   firebase init
   # Select Functions and Firestore
   # Choose your Firebase project
   ```

5. **Build functions**

   ```bash
   npm run build
   ```

6. **Test locally with emulator** (optional)

   ```bash
   npm run serve
   ```

7. **Deploy to Firebase**

   ```bash
   npm run deploy
   ```

8. **Copy function URLs**
   After deployment, Firebase will output function URLs. Copy these to your frontend `.env.local` file.

### Firestore Setup

Initialize the Firestore database:

1. Go to Firebase Console → Firestore Database
2. Create database in production mode (or test mode for development)
3. Create collection: `stats`
4. Add document with ID: `verse`
5. Add field: `count` (number) = 0

The `rateLimits` collection will be created automatically.

## Development

### Frontend Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Firebase Functions Development

```bash
cd functions

# Watch mode (auto-rebuild on changes)
npm run build:watch

# Start Firebase emulator
npm run serve

# View function logs
npm run logs
```

### Project Structure

```
daily-verse-generator/
├── src/
│   ├── app/
│   │   ├── actions.ts              # Server actions (includes Unsplash)
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── theme.tsx               # Chakra UI theme with keyframes
│   ├── components/
│   │   ├── googleAnalytics/
│   │   │   └── GoogleAnalytics.tsx
│   │   ├── ui/                     # Chakra UI components
│   │   └── verseGenerator/
│   │       ├── Header.tsx
│   │       ├── VerseGenerator.tsx
│   │       └── VerseGeneratorElements.tsx
│   ├── contexts/
│   │   └── TranslationContext.tsx
│   ├── lib/
│   │   ├── firebase.ts             # Firebase initialization
│   │   └── types/
│   └── assets/
│       ├── tranquil.png            # Fallback banner image
│       └── EBGarmond-regular.ttf   # Font for verse images
├── functions/
│   ├── src/
│   │   ├── index.ts                # Cloud Functions
│   │   └── assets/
│   │       └── EBGaramond-Regular.ttf
│   ├── package.json
│   └── tsconfig.json
├── .env.local                       # Environment variables
├── firebase.json                    # Firebase config
├── next.config.ts                   # Next.js config (includes Unsplash domain)
├── package.json
└── tsconfig.json
```

## Deployment

### Deploy Frontend

**Option 1: Vercel (Recommended)**

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Option 2: Firebase Hosting**

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Deploy Backend Functions

```bash
cd functions
npm run deploy
```

Or deploy from root:

```bash
firebase deploy --only functions
```

### Update Function URLs

After deploying functions, update your frontend environment variables with the new function URLs.

## Rate Limiting

The backend implements IP-based rate limiting:

- **Limit**: 20 requests per IP address
- **Window**: 1 minute (60 seconds)
- **Storage**: Firestore (`rateLimits` collection)
- **Response**: 429 Too Many Requests when exceeded

## Customization

### Change Color Theme

Edit `src/app/theme.tsx` to customize the tranquil color palette:

- `tranquilTeal` - Main theme color
- `tranquilGold` - Accent color
- `tranquilCream` - Light backgrounds
- `tranquilSky` - Sky blue tones
- `tranquilNavy` - Dark backgrounds

### Add Bible Translations

1. Update `src/components/verseGenerator/Header.tsx` to add translation option
2. Ensure the translation is supported by Bible-API.com

### Customize Image Generation

Edit `functions/src/index.ts`:

- Modify `createTextSVG()` for different fonts, sizes, layouts
- Change `generateDarkHexColor()` for different color ranges
- Update `availableIcons` array to add/remove decorative icons

## License

This project is developed by [Clark Perfecto](https://acperfecto.vercel.app/).

## Acknowledgments

- Bible verses provided by [Bible-API.com](https://bible-api.com)
- Daily banner images provided by [Unsplash](https://unsplash.com)
- Font: EB Garamond
- Icons: FontAwesome Free
- UI Components: Chakra UI v3
- Image Processing: Sharp
