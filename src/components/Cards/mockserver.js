const {Router} = require('express');
const axios = require('axios');

module.exports = (router = new Router()) => {
  router.get('/api/cards', async (req, res) => {
    const { data: userData } = await axios.get(
      '/api/cards'
    );
    const {
        cards
    } = userData
    return res.json({
        cards
    });
  });
  return router;
};