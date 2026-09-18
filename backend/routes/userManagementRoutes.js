const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/userManagementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/users', protect, userManagementController.getUsers);
router.post('/users', protect, userManagementController.createUser);
router.put('/users/:id', protect, userManagementController.updateUser);
router.delete('/users/:id', protect, userManagementController.deleteUser);

router.get('/roles', protect, userManagementController.getRoles);
router.get('/roles/:id', protect, userManagementController.getRoleById);
router.post('/roles', protect, userManagementController.createRole);
router.put('/roles/:id', protect, userManagementController.updateRole);
router.delete('/roles/:id', protect, userManagementController.deleteRole);

router.get('/role-assignments', protect, userManagementController.getRoleAssignments);
router.post('/role-assignments', protect, userManagementController.createRoleAssignment);
router.delete('/role-assignments/:id', protect, userManagementController.deleteRoleAssignment);

module.exports = router;
