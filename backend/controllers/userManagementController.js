const User = require('../models/User');
const Role = require('../models/Role');
const RoleAssignment = require('../models/RoleAssignment');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    
    // Always hide super_admins from lists
    let query = { role: { $nin: ['super_admin'] } };
    
    // Franchise Isolation
    if (req.user.role === 'franchise') {
      query.franchiseId = req.user.franchiseId;
    } else if (req.query.franchiseId) {
      // Super Admin filtering
      query.franchiseId = req.query.franchiseId;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query).populate('franchiseId', 'name franchiseName').limit(limit).skip((page - 1) * limit);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    let { firstName, lastName, email, phone, password, franchiseId, role } = req.body;
    
    // Franchise Isolation
    if (req.user.role === 'franchise') {
      franchiseId = req.user.franchiseId;
    }

    const user = new User({
      firstName, lastName, email, phone, password, franchiseId: franchiseId || null, role: role || 'user'
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await RoleAssignment.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    let query = {};
    
    // Franchise Isolation: Franchise can see its own roles OR global roles (where franchiseId is null)
    if (req.user.role === 'franchise') {
      query.$or = [
        { franchiseId: req.user.franchiseId },
        { franchiseId: null }
      ];
    } else if (req.query.franchiseId) {
      query.franchiseId = req.query.franchiseId;
    }

    const roles = await Role.find(query).populate('franchiseId', 'name franchiseName');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    let { name, description, franchiseId, permissions } = req.body;
    
    // Franchise Isolation
    if (req.user.role === 'franchise') {
      franchiseId = req.user.franchiseId;
    }

    const role = new Role({
      name, description, franchiseId: franchiseId || null, permissions: permissions || []
    });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    
    // Check isolation
    if (req.user.role === 'franchise' && role.franchiseId && role.franchiseId.toString() !== req.user.franchiseId.toString()) {
       return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, description, franchiseId, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    
    if (!role) return res.status(404).json({ error: 'Role not found' });
    
    if (req.user.role === 'franchise' && role.franchiseId && role.franchiseId.toString() !== req.user.franchiseId.toString()) {
       return res.status(403).json({ error: 'Forbidden' });
    }

    role.name = name || role.name;
    role.description = description !== undefined ? description : role.description;
    role.permissions = permissions || role.permissions;
    if (req.user.role !== 'franchise') {
      role.franchiseId = franchiseId || null;
    }
    
    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    await RoleAssignment.deleteMany({ roleId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoleAssignments = async (req, res) => {
  try {
    let query = {};
    
    // Note: We'll filter the populated userId to enforce isolation in the results.
    const assignments = await RoleAssignment.find(query)
      .populate({ 
        path: 'userId', 
        match: req.user.role === 'franchise' ? { franchiseId: req.user.franchiseId } : {},
        populate: { path: 'franchiseId', select: 'name franchiseName' } 
      })
      .populate({
        path: 'roleId',
        populate: { path: 'franchiseId', select: 'name franchiseName' }
      });
      
    // Filter out assignments where the populated userId was excluded due to match (Franchise Isolation)
    const filteredAssignments = req.user.role === 'franchise' 
      ? assignments.filter(a => a.userId != null)
      : assignments;

    res.json(filteredAssignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoleAssignment = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    
    // Check if assignment exists
    const existing = await RoleAssignment.findOne({ userId, roleId });
    if (existing) return res.status(400).json({ error: 'Role already assigned to user' });
    
    const assignment = new RoleAssignment({ userId, roleId });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoleAssignment = async (req, res) => {
  try {
    await RoleAssignment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
