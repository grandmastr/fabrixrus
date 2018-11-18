const express = require('express')
,router = express();


const Admin = require('../models/admin');

router.get('/admin',(req,res) => {
    res.render('admin/login');
})