import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.id;
    }
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a name' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Please provide an email' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a password' }
    }
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSeller: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  passwordChangedAt: {
    type: DataTypes.DATE
  },
  passwordResetToken: {
    type: DataTypes.STRING
  },
  passwordResetExpires: {
    type: DataTypes.DATE
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

// Hook for hashing password
const hashPassword = async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    user.passwordChangedAt = new Date(Date.now() - 1000);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);

// Instance methods
User.prototype.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

User.prototype.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.update({
      failedLoginAttempts: 1,
      lockUntil: null
    });
  }
  
  const failedLoginAttempts = this.failedLoginAttempts + 1;
  const updates = { failedLoginAttempts };
  
  if (failedLoginAttempts >= 5) {
    updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  return await this.update(updates);
};

export default User;