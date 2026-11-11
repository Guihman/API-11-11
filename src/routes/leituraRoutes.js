const express = require('express');
const leituraController = require('../controllers/LeituraController');

const router = express.Router();

router.get('/', leituraController.list);
router.get('/:id', leituraController.findById);
router.post('/', leituraController.create);
router.put('/:id', leituraController.update);
router.delete('/', leituraController.deleteAll);
router.delete('/:id', leituraController.deleteById);

module.exports = router;
