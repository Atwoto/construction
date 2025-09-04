const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const User = require('./src/models/User');
const { createError, asyncHandler } = require('./src/middleware/errorHandler');
const AuthUtils = require('./src/utils/authUtils');

const app = express();
app.use(express.json());

// Validation middleware
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'employee'])
    .withMessage('Role must be admin, manager, or employee'),
];

// Test registration endpoint
app.post('/test-register', validateRegister, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password, firstName, lastName, role = 'employee' } = req.body;
  console.log('Request body:', req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Validate password strength
    const passwordValidation = AuthUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      console.log('Password validation failed:', passwordValidation);
      return res.status(400).json({ 
        message: 'Password does not meet requirements', 
        details: passwordValidation 
      });
    }

    console.log('Creating user with data:', { email, firstName, lastName, role });
    
    // Create user in our database directly (without Supabase Auth)
    const userData = {
      email: email.toLowerCase(),
      password: password, // Include the password here
      first_name: firstName,
      last_name: lastName,
      role,
      is_email_verified: true // Set to true to avoid verification issues
    };

    const user = await User.create(userData);
    
    console.log('User created successfully:', user.email);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}));

const port = 3002;
app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
});