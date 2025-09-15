const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const NodeCache = require('node-cache');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const contentService = require('./services/contentService');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Rate limiting: 100 requests per hour per IP
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100,
  duration: 3600,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rateLimiterRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
});

// API Routes
app.get('/api/search', async (req, res) => {
  try {
    const { query, page = 1, category = 'all' } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query must be at least 2 characters long'
      });
    }

    const cacheKey = `search_${query}_${page}_${category}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const results = await contentService.searchContent({
      query: query.trim(),
      page: parseInt(page),
      category
    });

    cache.set(cacheKey, results);
    res.json(results);
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'Unable to process search request'
    });
  }
});

app.get('/api/random', async (req, res) => {
  try {
    const { category = 'manga' } = req.query;
    const cacheKey = `random_${category}_${Math.floor(Date.now() / 300000)}`; // 5min cache
    
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const result = await contentService.getRandomContent(category);
    cache.set(cacheKey, result, 300); // 5 minute cache for random
    
    res.json(result);
  } catch (error) {
    console.error('Random content error:', error);
    res.status(500).json({
      error: 'Failed to get random content',
      message: 'Unable to fetch random content'
    });
  }
});

app.get('/api/trending', async (req, res) => {
  try {
    const cacheKey = 'trending_content';
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const results = await contentService.getTrendingContent();
    cache.set(cacheKey, results, 1800); // 30 minute cache
    
    res.json(results);
  } catch (error) {
    console.error('Trending content error:', error);
    res.status(500).json({
      error: 'Failed to get trending content',
      message: 'Unable to fetch trending content'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    cache_stats: cache.getStats()
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`🚀 HentaiXpert Backend running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});

module.exports = app;
