const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    // Import User model
    const User = require('./models/User');

    // Find users with invalid roles
    const validRoles = ["admin", "super_admin", "user", "franchise"];
    const invalidUsers = await User.find({ role: { $nin: validRoles } });
    
    console.log(`Found ${invalidUsers.length} users with corrupted roles.`);
    
    for (let u of invalidUsers) {
      const newRole = u.franchiseId ? 'franchise' : 'user';
      console.log(`Fixing user: ${u.email} | Old Role: ${u.role} -> New Role: ${newRole}`);
      u.role = newRole;
      await u.save();
    }
    
    // Check specifically for dhashnamoorthipalanivel@gmail.com
    const mainUser = await User.findOne({ email: 'dhashnamoorthipalanivel@gmail.com' });
    if (mainUser && !validRoles.includes(mainUser.role)) {
       mainUser.role = mainUser.franchiseId ? 'franchise' : 'admin';
       await mainUser.save();
       console.log(`Fixed dhashnamoorthipalanivel@gmail.com -> ${mainUser.role}`);
    } else if (mainUser && mainUser.role === 'admin' && mainUser.franchiseId) {
       mainUser.role = 'franchise'; // ensure franchise owners are correctly typed
       await mainUser.save();
       console.log(`Updated dhashnamoorthipalanivel@gmail.com to franchise role`);
    } else if (mainUser) {
       console.log(`dhashnamoorthipalanivel@gmail.com role is currently: ${mainUser.role}`);
       if (mainUser.role === 'user' && mainUser.franchiseId) {
           mainUser.role = 'franchise';
           await mainUser.save();
           console.log(`Updated dhashnamoorthipalanivel@gmail.com to franchise role`);
       }
    }
    
    console.log("Done.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
