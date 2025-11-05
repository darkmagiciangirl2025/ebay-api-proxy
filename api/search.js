export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300');
  
  const query = req.query.query || 'Pokemon PSA Charizard';
  const APP_ID = 'GempireC-GempireC-PRD-6ebb9ef4f-3603a0c7';
  
  try {
    const ebayUrl = 'https://svcs.ebay.com/services/search/FindingService/v1?' +
      'OPERATION-NAME=findItemsByKeywords' +
      '&SERVICE-VERSION=1.0.0' +
      '&SECURITY-APPNAME=' + APP_ID +
      '&RESPONSE-DATA-FORMAT=JSON' +
      '&REST-PAYLOAD' +
      '&keywords=' + encodeURIComponent(query) +
      '&paginationInput.entriesPerPage=24' +
      '&sortOrder=PricePlusShippingHighest';
    
    const ebayResponse = await fetch(ebayUrl);
    const data = await ebayResponse.json();
    
    if (data.errorMessage) {
      return res.status(429).json({ 
        error: 'Rate limited',
        items: []
      });
    }
    
    const rawItems = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    
    const items = rawItems
      .map(item => {
        const price = parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || 0);
        return {
          title: item.title?.[0] || 'Untitled',
          price: price,
          currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
          image: item.galleryURL?.[0] || '',
          url: item.viewItemURL?.[0] || '',
          condition: item.condition?.[0]?.conditionDisplayName?.[0] || 'See listing'
        };
      })
      .filter(item => item.price >= 500);
    
    return res.status(200).json({ 
      items: items,
      count: items.length 
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      items: []
    });
  }
}
```

---

## After You Commit:

1. **Wait 30-60 seconds** for Vercel to redeploy
2. **Test the API** again at:
```
   https://ebay-api-proxy.vercel.app/api/search
