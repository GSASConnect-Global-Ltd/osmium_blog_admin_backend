import Academic from "../models/Academic.js";

// Create course
export const createAcademic = async (req, res) => {
  try {
    const academic = await Academic.create(req.body);
    res.status(201).json(academic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all courses
export const getAcademics = async (req, res) => {
  const academics = await Academic.find();
  res.json(academics);
};

// Get single course
export const getAcademic = async (req, res) => {
  const academic = await Academic.findById(req.params.id);
  res.json(academic);
};

// Update
export const updateAcademic = async (req, res) => {
  const academic = await Academic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(academic);
};

// Delete
export const deleteAcademic = async (req, res) => {
  await Academic.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
