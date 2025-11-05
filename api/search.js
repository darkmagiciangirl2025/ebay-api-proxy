// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300'); // Cache at edge for 5 minutes
  
  const { query = 'Pokemon PSA Charizard' } = req.query;
  const APP_ID = 'GempireC-GempireC-PRD-6ebb9ef4f-3603a0c7';
  
  // Check cache first
  const cacheKey = `ebay_${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached results for:', query);
    return res.status(200).json(cached.data);
  }
  
  try {
    const ebayUrl = `https://svcs.ebay.com/services/search/FindingService/v1?` +
      `OPERATION-NAME=findItemsByKeywords` +
      `&SERVICE-VERSION=1.0.0` +
      `&SECURITY-APPNAME=${APP_ID}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&keywords=${encodeURIComponent(query)}` +
      `&paginationInput.entriesPerPage=24` +
      `&sortOrder=PricePlusShippingHighest`;
    
    const response = await fetch(ebayUrl);
    const data = await response.json();
    
    // Check for errors
    if (data.errorMessage) {
      console.error('eBay API Error:', data.errorMessage);
      return res.status(429).json({ 
        error: 'Rate limited by eBay',
        message: 'Please try again in a few minutes',
        items: []
      });
    }
    
    const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    
    // Filter for items over $500 (since eBay's MinPrice filter isn't working)
    const formattedItems = items
      .map(item => ({
        tit
