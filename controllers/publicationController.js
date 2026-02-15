import Publication from "../models/Publication.js";


// Create publication
export const createPublication = async (req, res) => {
  try {
    const { title, authors, publicationDate, abstract } = req.body;

    const publication = await Publication.create({
      title,
      authors,
      publicationDate,
      abstract,
    });

    res.status(201).json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all publications
export const getPublications = async (req, res) => {
  try {
    const publications = await Publication.find().sort({
      publicationDate: -1,
    });

    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single publication
export const getPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication)
      return res.status(404).json({ message: "Publication not found" });

    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update publication
export const updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!publication)
      return res.status(404).json({ message: "Publication not found" });

    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete publication
export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);

    if (!publication)
      return res.status(404).json({ message: "Publication not found" });

    res.json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
