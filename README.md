# HentaiXpert

A modern content discovery platform with integrated API backend for seamless content searching and browsing.

## 🚀 Features

### Version 1.0 - Major API Integration Update
- **Real API Integration**: No more redirects! Get actual search results directly in the app
- **Beautiful Card-based UI**: Modern grid layout with hover effects and smooth animations
- **Advanced Content Display**: Shows ratings, view counts, tags, and metadata for each result
- **Smart Caching**: Built-in caching system for better performance and faster loading
- **Rate Limiting**: Protection against abuse with intelligent rate limiting
- **Favorites System**: Save and manage your favorite content with local storage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Loading States**: Smooth loading animations and error handling
- **Pagination Support**: Browse through multiple pages of results
- **Category Filtering**: Filter by manga, anime, images, or view all
- **Enhanced Search**: Improved search with better error handling and validation

### Previous Features
- Light and dark mode toggle with smooth transitions
- Typewriter text effect animation
- "I'm Feeling Lucky" button for random content discovery
- Clean, modern UI with gradient effects and animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm start
   ```
   
   Or on Windows, simply double-click `start.bat`

3. **Open Your Browser**
   Navigate to `http://localhost:3000`

### Development Mode
```bash
npm run dev
```

## 📁 Project Structure

```
hentaixpert/
├── server.js              # Express backend server
├── services/
│   └── contentService.js  # Content aggregation service
├── public/                # Frontend assets
│   ├── index.html         # Main HTML file
│   ├── script.js          # Frontend JavaScript
│   ├── style.css          # CSS styles
│   └── *.png             # Image assets
├── package.json           # Dependencies and scripts
└── start.bat             # Windows startup script
```

## 🔧 API Endpoints

- `GET /api/search?query={term}&page={num}&category={type}` - Search content
- `GET /api/random?category={type}` - Get random content
- `GET /api/trending` - Get trending content
- `GET /api/health` - Health check and statistics

## 🎨 UI Features

- **Grid-based Layout**: Responsive card system that adapts to screen size
- **Hover Effects**: Interactive cards with smooth animations
- **Rating System**: Star ratings displayed prominently
- **Tag System**: Color-coded tags for easy content categorization
- **View Statistics**: Display of view counts, page counts, and durations
- **Favorite System**: Heart-shaped favorite buttons with local storage
- **Loading Spinners**: Professional loading animations
- **Error Handling**: User-friendly error messages and retry options

## 🔒 Security & Performance

- **Rate Limiting**: 100 requests per hour per IP address
- **Helmet.js**: Security headers and protection
- **CORS**: Cross-origin resource sharing configured
- **Caching**: Smart caching system with configurable TTL
- **Input Validation**: Sanitized search queries and parameter validation

## 📱 Responsive Design

- **Desktop**: Full-featured experience with grid layout
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Single-column layout optimized for small screens

## 🎯 Usage

1. **Search**: Enter your search terms in the search box
2. **Browse**: View results in a beautiful card layout
3. **Filter**: Use category filters to narrow down results
4. **Favorite**: Click the heart icon to save favorite items
5. **Random**: Use "I'm Feeling Lucky" for random discoveries
6. **Navigate**: Use pagination to browse through multiple pages

## 🚀 What's New in v1.0

- Complete backend rewrite with Express.js
- Real API integration replacing redirect-based system  
- Modern card-based UI design
- Advanced caching and rate limiting
- Responsive design for all devices
- Enhanced error handling and loading states
- Local favorites system
- Professional animations and transitions

---

*HentaiXpert v1.0 - Where content discovery meets modern web technology*
