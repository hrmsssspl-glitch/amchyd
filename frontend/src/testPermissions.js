// Test script to verify permissions are saved
const testPermissions = () => {
  console.log('=== Testing HRMS Permissions ===');
  
  // Check if permissions are saved
  const saved = localStorage.getItem('hrms_permissions');
  console.log('Saved permissions:', saved ? '✅ Found' : '❌ Not found');
  
  if (saved) {
    const parsed = JSON.parse(saved);
    console.log('Parsed permissions:', parsed);
    
    // Test each role
    const roles = ['admin', 'hr', 'manager', 'employee'];
    roles.forEach(role => {
      if (parsed[role]) {
        console.log(`${role.toUpperCase()}: ${parsed[role].moduleIds?.length || 0} modules, ${parsed[role].menuIds?.length || 0} menus`);
      }
    });
  }
  
  // Check current user
  const user = localStorage.getItem('hrms_auth');
  console.log('Current user:', user ? JSON.parse(user) : 'Not logged in');
  
  console.log('=== Test Complete ===');
};

// Run test
testPermissions();