const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const key = req.query.key;
  const location = req.query.location || '';
  const start = req.query.start_index || 0;
  try {
    let url;
    if (location) {
      url = `https://api.company-information.service.gov.uk/advanced-search/companies?company_name_includes=${encodeURIComponent(query)}&registered_office_address=${encodeURIComponent(location)}&company_status=active&size=100&start_index=${start}`;
    } else {
      url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}&items_per_page=100`;
    }
    const response = await fetch(url, {
      headers: { Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64') }
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/officers', async (req, res) => {
  const num = req.query.company_number;
  const key = req.query.key;
  try {
    const url = `https://api.company-information.service.gov.uk/company/${num}/officers?items_per_page=50`;
    const response = await fetch(url, {
      headers: { Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64') }
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
