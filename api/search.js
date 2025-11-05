export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({ 
    test: 'working',
    items: [
      {
        title: 'Test Pokemon Card',
        price: 599.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/400',
        url: 'https://ebay.com',
        condition: 'PSA 10'
      }
    ],
    count: 1
  });
}
```

This just returns fake data to test if the function works at all.

**Commit this, wait 30 seconds, then test:**
```
https://ebay-api-proxy.vercel.app/api/search
