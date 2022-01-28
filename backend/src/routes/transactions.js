const { query } = require('express');
const express = require('express');
const res = require('express/lib/response');
const { beginTransaction } = require('../database');
const router = express.Router();
const mysqlConnection = require('../database');



router.get('/getTransactions', (req, res) => {
    mysqlConnection.query('SELECT * FROM transactions', (err, rows, fields) => {
        if(!err) {
            res.json(rows)
        } else {
            console.error(err)
        }
    });
});

router.get('/:id', (req, res) => {
    const {id} = req.params
    mysqlConnection.query('SELECT * FROM transactions WHERE id = ?', [id], (err, rows, fields) =>{
        if(!err) {
            res.json(rows[0])
        } else {
            console.error(err)
        }
    })
})

// Borrar transaccion
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    mysqlConnection.query('DELETE FROM Transactions WHERE id = ?', [id], (err, rows, fields) => {
      if(!err) {
        res.json({status: 'Transaction Deleted'});
      } else {
        res.json({status: 'ERROR '+err});;
      }
    }); 
  });  
  
   // Editar transaccion
  router.put('/:id', (req, res) => {
    var {date,type,amt,name } = req.body;
    var {id} = req.params;

    var query = "UPDATE Transactions SET type = '"+type+"', name= '"+name+"', date= '"+date+"',amt = '"+amt+"' WHERE id = "+id;
    console.log(date);
    mysqlConnection.query(query, null, (err, rows, fields) => {
      if(!err) {
        res.json({status: 'Transaction Saved'});
      } else {
        console.log(err);
      }
    });      
  }); 

  // Crear transaccion
router.post('/', (req, res) => {
    let query = "INSERT INTO Transactions SET ?";

    let customerTransaction = {
      type: req.body.type,
      date: req.body.date,
      name: req.body.name,
      amt: req.body.amt
    }

    mysqlConnection.query(query, customerTransaction, err => {
      if(!err) {
        console.log(req.body)
        res.json({status: 'Customer created'});
      } else {
        console.log(err);
      }
    });      
})

exports.transactions = router