const router = require('express').Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.get('/user/:userId', bookingController.getByUserId);
router.post('/', bookingController.create);
router.patch('/:id/status', bookingController.updateStatus);
router.delete('/:id', bookingController.delete);

module.exports = router;