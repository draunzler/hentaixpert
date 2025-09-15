const axios = require('axios');
const cheerio = require('cheerio');

class ContentService {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    this.timeout = 10000;
  }

  async searchContent({ query, page = 1, category = 'all' }) {
    try {
      const results = {
        query,
        page,
        total_pages: 1,
        results: []
      };

      // Search multiple sources
      const searchPromises = [];

      if (category === 'all' || category === 'manga') {
        searchPromises.push(this.searchManga(query, page));
      }

      if (category === 'all' || category === 'anime') {
        searchPromises.push(this.searchAnime(query, page));
      }

      if (category === 'all' || category === 'images') {
        searchPromises.push(this.searchImages(query, page));
      }

      const searchResults = await Promise.allSettled(searchPromises);
      
      // Combine results from all sources
      searchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.results = results.results.concat(result.value.results || []);
        }
      });

      // Sort by relevance/popularity and limit results
      results.results = results.results
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 20);

      return results;
    } catch (error) {
      console.error('Search content error:', error);
      throw new Error('Failed to search content');
    }
  }

  async searchManga(query, page = 1) {
    try {
      // Mock implementation - replace with actual data source
      const mockResults = this.generateMockMangaResults(query, page);
      return {
        source: 'manga',
        results: mockResults
      };
    } catch (error) {
      console.error('Manga search error:', error);
      return { source: 'manga', results: [] };
    }
  }

  async searchAnime(query, page = 1) {
    try {
      // Mock implementation - replace with actual data source
      const mockResults = this.generateMockAnimeResults(query, page);
      return {
        source: 'anime',
        results: mockResults
      };
    } catch (error) {
      console.error('Anime search error:', error);
      return { source: 'anime', results: [] };
    }
  }

  async searchImages(query, page = 1) {
    try {
      // Mock implementation - replace with actual data source
      const mockResults = this.generateMockImageResults(query, page);
      return {
        source: 'images',
        results: mockResults
      };
    } catch (error) {
      console.error('Image search error:', error);
      return { source: 'images', results: [] };
    }
  }

  async getRandomContent(category = 'manga') {
    try {
      const randomId = Math.floor(Math.random() * 100000) + 1;
      
      return {
        id: randomId,
        title: `Random ${category.charAt(0).toUpperCase() + category.slice(1)} #${randomId}`,
        thumbnail: `https://via.placeholder.com/300x400/ff69b4/ffffff?text=${category}+${randomId}`,
        source: category,
        rating: (Math.random() * 5).toFixed(1),
        views: Math.floor(Math.random() * 1000000),
        tags: this.generateRandomTags(),
        url: `#${category}/${randomId}`
      };
    } catch (error) {
      console.error('Random content error:', error);
      throw new Error('Failed to get random content');
    }
  }

  async getTrendingContent() {
    try {
      const trending = [];
      
      for (let i = 1; i <= 10; i++) {
        trending.push({
          id: i,
          title: `Trending Item #${i}`,
          thumbnail: `https://via.placeholder.com/300x400/ff1493/ffffff?text=Trending+${i}`,
          source: ['manga', 'anime', 'images'][i % 3],
          rating: (4 + Math.random()).toFixed(1),
          views: Math.floor(Math.random() * 500000) + 500000,
          tags: this.generateRandomTags(),
          url: `#trending/${i}`
        });
      }

      return {
        trending,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Trending content error:', error);
      throw new Error('Failed to get trending content');
    }
  }

  generateMockMangaResults(query, page) {
    const results = [];
    const baseIndex = (page - 1) * 10;

    for (let i = 1; i <= 10; i++) {
      const id = baseIndex + i;
      results.push({
        id,
        title: `${query} Manga #${id}`,
        thumbnail: `https://via.placeholder.com/300x400/ff69b4/ffffff?text=Manga+${id}`,
        source: 'manga',
        rating: (Math.random() * 5).toFixed(1),
        views: Math.floor(Math.random() * 100000),
        pages: Math.floor(Math.random() * 50) + 10,
        tags: this.generateRandomTags(),
        url: `#manga/${id}`,
        preview_images: this.generatePreviewImages(id)
      });
    }

    return results;
  }

  generateMockAnimeResults(query, page) {
    const results = [];
    const baseIndex = (page - 1) * 10;

    for (let i = 1; i <= 8; i++) {
      const id = baseIndex + i;
      results.push({
        id,
        title: `${query} Anime #${id}`,
        thumbnail: `https://via.placeholder.com/300x400/ff1493/ffffff?text=Anime+${id}`,
        source: 'anime',
        rating: (Math.random() * 5).toFixed(1),
        views: Math.floor(Math.random() * 200000),
        duration: `${Math.floor(Math.random() * 30) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        tags: this.generateRandomTags(),
        url: `#anime/${id}`,
        preview_gif: `https://via.placeholder.com/400x225/ff1493/ffffff?text=Preview+${id}`
      });
    }

    return results;
  }

  generateMockImageResults(query, page) {
    const results = [];
    const baseIndex = (page - 1) * 10;

    for (let i = 1; i <= 12; i++) {
      const id = baseIndex + i;
      results.push({
        id,
        title: `${query} Image #${id}`,
        thumbnail: `https://via.placeholder.com/300x300/ff69b4/ffffff?text=Image+${id}`,
        source: 'images',
        rating: (Math.random() * 5).toFixed(1),
        views: Math.floor(Math.random() * 50000),
        resolution: `${800 + Math.floor(Math.random() * 1200)}x${600 + Math.floor(Math.random() * 800)}`,
        tags: this.generateRandomTags(),
        url: `#image/${id}`,
        full_image: `https://via.placeholder.com/800x600/ff69b4/ffffff?text=Full+Image+${id}`
      });
    }

    return results;
  }

  generateRandomTags() {
    const allTags = [
      'romance', 'comedy', 'drama', 'fantasy', 'adventure', 'action',
      'slice of life', 'supernatural', 'mystery', 'school', 'mature',
      'popular', 'completed', 'ongoing', 'award winner'
    ];
    
    const numTags = Math.floor(Math.random() * 5) + 2;
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  }

  generatePreviewImages(id) {
    const previews = [];
    const numPreviews = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 1; i <= numPreviews; i++) {
      previews.push(`https://via.placeholder.com/300x400/ff69b4/ffffff?text=Page+${i}`);
    }
    
    return previews;
  }
}

module.exports = new ContentService();
