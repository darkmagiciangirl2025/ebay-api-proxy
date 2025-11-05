export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({ 
    test: 'working',
    items: [
      {
        title: 'Test Pokemon PSA 10 Charizard',
        price: 1599.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Test+Card',
        url: 'https://ebay.com',
        condition: 'PSA 10'
      },
      {
        title: 'Test Pokemon PSA 9 Blastoise',
        price: 899.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Test+Card+2',
        url: 'https://ebay.com',
        condition: 'PSA 9'
      }
    ],
    count: 2
  });
}
