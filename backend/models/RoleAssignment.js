const mongoose = require('mongoose');

const roleAssignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('RoleAssignment', roleAssignmentSchema);
