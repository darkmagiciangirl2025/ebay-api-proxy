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
      `&paginationInput.entriesPerPage=12` +
      `&sortOrder=PricePlusShippingHighest` +
      `&itemFilter(0).name=ListingType` +
      `&itemFilter(0).value(0)=AuctionWithBIN` +
      `&itemFilter(0).value(1)=FixedPrice`;
    
    const response = await fetch(ebayUrl);
    const data = await response.json();
    
    const items = data.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item || [];
    
    const formattedItems = items.map(item => ({
      title: item.title?.[0],
      price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__,
      currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'],
      image: item.galleryURL?.[0],
      url: item.viewItemURL?.[0],
      condition: item.condition?.[0]?.conditionDisplayName?.[0] || 'N/A'
    }));
    
    res.status(200).json({ items: formattedItems });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch eBay listings', details: error.message });
  }
}
