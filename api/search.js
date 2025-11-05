export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { query = 'Pokemon PSA' } = req.query;
  const APP_ID = 'GempireC-GempireC-PRD-6ebb9ef4f-3603a0c7';
  
  try {
    const ebayUrl = `https://svcs.ebay.com/services/search/FindingService/v1?` +
      `OPERATION-NAME=findItemsAdvanced` +
      `&SERVICE-VERSION=1.0.0` +
      `&SECURITY-APPNAME=${APP_ID}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&keywords=${encodeURIComponent(query)}` +
      `&paginationInput.entriesPerPage=20` +
      `&sortOrder=PricePlusShippingHighest` +
      `&itemFilter(0).name=MinPrice` +
      `&itemFilter(0).value=1000` +
      `&itemFilter(0).paramName=Currency` +
      `&itemFilter(0).paramValue=USD`;
    
    const response = await fetch(ebayUrl);
    const data = await response.json();
    
    const items = data.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item || [];
    
    const formattedItems = items.map(item => ({
      title: item.title?.[0] || 'Untitled',
      price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || '0',
      currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
      image: item.galleryURL?.[0] || item.pictureURLLarge?.[0] || '',
      url: item.viewItemURL?.[0] || '',
      condition: item.condition?.[0]?.conditionDisplayName?.[0] || 'See listing'
    }));
    
    res.status(200).json({ 
      items: formattedItems,
      count: formattedItems.length 
    });
    
  } catch (error) {
    console.error('eBay API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch eBay listings', 
      details: error.message,
      items: []
    });
  }
}
