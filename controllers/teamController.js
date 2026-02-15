import TeamMember from "../models/TeamMember.js";

// ---------------- GET ALL TEAM MEMBERS ----------------
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching team members" });
  }
};

// ---------------- GET SINGLE TEAM MEMBER ----------------
export const getTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member)
      return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching team member" });
  }
};

// ---------------- CREATE TEAM MEMBER ----------------
export const createTeamMember = async (req, res) => {
  try {
    const { name, post, socials, bio } = req.body;

    let socialsArray = [];
    if (socials) {
      try {
        const parsed = JSON.parse(socials);
        if (Array.isArray(parsed)) {
          socialsArray = parsed.filter(
            (s) => s.platform && s.url // only keep valid socials
          );
        }
      } catch (err) {
        console.warn("Invalid socials JSON:", err);
      }
    }

    const member = new TeamMember({
      name,
      post,
      bio,
      socials: socialsArray,
      photo: req.file ? req.file.path : undefined,
      photoId: req.file ? req.file.filename : undefined,

    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating team member" });
  }
};

// ---------------- UPDATE TEAM MEMBER ----------------
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, post, socials, bio } = req.body;

    const updateData = { name, post, bio };

    // Update socials only if valid
    if (socials) {
      try {
        const parsed = JSON.parse(socials);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (s) => s.platform && s.url
          );
          if (filtered.length > 0) updateData.socials = filtered;
        }
      } catch (err) {
        console.warn("Invalid socials JSON:", err);
      }
    }

    // Update photo if new file uploaded
    if (req.file) {
      updateData.photo = req.file.path;
      updateData.photoId = req.file.filename;
    }


    const updated = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Team member not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating team member" });
  }
};

// ---------------- DELETE TEAM MEMBER ----------------
export const deleteTeamMember = async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Team member not found" });
    res.json({ message: "Team member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting team member" });
  }
};
