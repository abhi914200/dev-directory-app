import Developer from '../models/Developer.js';

// Helper: parse comma-separated tech stack into array
const parseTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) return techStack;
  return techStack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

// @desc    Create a new developer
// @route   POST /api/developers
// @access  Private
export const createDeveloper = async (req, res) => {
  try {
    const {
      name,
      role,
      techStack,
      experience,
      description,
      joiningDate,
      photoUrl
    } = req.body;

    // Basic validation (we’ll later enhance with Joi/Zod if needed)
    if (!name || !role || !techStack || experience === undefined) {
      return res
        .status(400)
        .json({ message: 'Name, role, tech stack, experience are required' });
    }

    const techStackArray = parseTechStack(techStack);

    const developer = await Developer.create({
      name,
      role,
      techStack: techStackArray,
      experience,
      description: description || '',
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      photoUrl: photoUrl || '',
      createdBy: req.user._id // from authMiddleware
    });

    res.status(201).json(developer);
  } catch (err) {
    console.error('Create developer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all developers (with search, filter, sort, pagination)
// @route   GET /api/developers
// @access  Private
export const getDevelopers = async (req, res) => {
  try {
    const {
      search = '',
      role,
      sortBy = 'experience', // 'experience' or 'createdAt'
      sortOrder = 'desc', // 'asc' or 'desc'
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search by name or tech stack
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // case-insensitive

      query.$or = [
        { name: searchRegex },
        { techStack: searchRegex } // matches any element in array
      ];
    }

    // Filter by role
    if (role && ['Frontend', 'Backend', 'Full-Stack','Data Analyst','DevOps'].includes(role)) {
      query.role = role;
    }

    // Pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sortField = sortBy === 'experience' ? 'experience' : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Execute query
    const [developers, total] = await Promise.all([
      Developer.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Developer.countDocuments(query)
    ]);

    res.json({
      data: developers,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    console.error('Get developers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single developer (profile page)
// @route   GET /api/developers/:id
// @access  Private
export const getDeveloperById = async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.json(developer);
  } catch (err) {
    console.error('Get developer by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a developer
// @route   PUT /api/developers/:id
// @access  Private
export const updateDeveloper = async (req, res) => {
  try {
    const {
      name,
      role,
      techStack,
      experience,
      description,
      joiningDate,
      photoUrl
    } = req.body;

    const developer = await Developer.findById(req.params.id);

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // (Optional) If you want only creator to edit:
    // if (developer.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not allowed to edit this developer' });
    // }

    if (name !== undefined) developer.name = name;
    if (role !== undefined) developer.role = role;

    if (techStack !== undefined) {
      developer.techStack = parseTechStack(techStack);
    }

    if (experience !== undefined) developer.experience = experience;
    if (description !== undefined) developer.description = description;
    if (joiningDate !== undefined) {
      developer.joiningDate = new Date(joiningDate);
    }
    if (photoUrl !== undefined) developer.photoUrl = photoUrl;

    const updatedDeveloper = await developer.save();

    res.json(updatedDeveloper);
  } catch (err) {
    console.error('Update developer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a developer
// @route   DELETE /api/developers/:id
// @access  Private
export const deleteDeveloper = async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // (Optional) Only creator delete:
    // if (developer.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not allowed to delete this developer' });
    // }

    await developer.deleteOne();

    res.json({ message: 'Developer removed' });
  } catch (err) {
    console.error('Delete developer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
