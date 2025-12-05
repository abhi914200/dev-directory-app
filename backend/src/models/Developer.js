import mongoose from 'mongoose';

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full-Stack','DataAnalyst','Devops'],
      required: true
    },
    techStack: {
      // store as array of strings: ['React', 'Node.js', 'MongoDB']
      type: [String],
      required: true
    },
    experience: {
      type: Number, // in years
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ''
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    photoUrl: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // which user created this developer
      required: true
    }
  },
  { timestamps: true }
);

const Developer = mongoose.model('Developer', developerSchema);

export default Developer;
