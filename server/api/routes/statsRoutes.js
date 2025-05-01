const express = require('express');
const { getGraphClient } = require('../services/masl');
const isAuthenticated = require('../utils/isAuthenticated');

const router = express.Router();

router.get('/summary', isAuthenticated, async (req,res) => {
  try {
    const client = getGraphClient();
    const users = await client.api('/users').top(999).select('accountEnabled', 'id', 'givenName').get();
    console.log(users);
    const total = users.value.length;
    const active = users.value.filter(user => user.accountEnabled).length;
    const inactive = total - active;

    res.json({ total, active, inactive });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Department Breakdown Route
router.get('/departments', isAuthenticated, async (req,res) => {
  try {
    const client = getGraphClient();
    const users = await client.api('/users').top(999).select('department').get();

    const departmentCounts = {};

    users.value.forEach(user => {
      const dept = user.department || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    res.json(departmentCounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// New Hires This Month Route
router.get('/new-hires', isAuthenticated, async (req,res) => {
  try {
    const client = getGraphClient();
    const today = new Date();
    const lastMonth = new Date(today.setDate(today.getDate() - 30)).toISOString();

    const users = await client.api('/users')
      .filter(`createdDateTime ge ${lastMonth}`)
      .select('displayName,createdDateTime')
      .top(999)
      .get();

    res.json(users.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch new hires' });
  }
});

module.exports = router;
