const { supabaseAdmin } = require('./src/config/supabase');

async function listUsers() {
  try {
    // Get all users
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log('All users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Email: "${user.email}", Name: ${user.first_name} ${user.last_name}`);
    });
  } catch (error) {
    console.error('Exception:', error);
  }
}

listUsers();