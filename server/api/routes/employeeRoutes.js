const express = require('express');
const isAuthenticated = require('../utils/isAuthenticated');
const { getAllEmployeesBasic, getEmployeeData } = require('../services/graphService');

const router = express.Router();

router.get('/', isAuthenticated, async (req,res, next) => {
  try {
    const data = await getAllEmployeesBasic();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/public/:id', async (req,res) => {
  try {
    const id = req.params.id;
    const employee = await getEmployeeData(id);

    if (!employee) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(employee); // No auth required here
  } catch (err) {
    console.error('Error fetching public employee data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
