const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/delete-user", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all lists owned by the user
    const { data: userLists, error: fetchListsError } = await supabase
      .from("Lists")
      .select("id")
      .eq("userId", userId);

    if (fetchListsError) {
      throw new Error(`Failed to fetch user lists: ${fetchListsError.message}`);
    }

    const listIds = userLists?.map((list) => list.id) || [];

    // 🔥 DELETE RECORDS IN CORRECT ORDER TO AVOID CONSTRAINT VIOLATIONS
    await deleteUserData(userId, listIds);

    // ✅ Delete user from Supabase Auth (must be last)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      throw new Error(`Failed to delete user from Auth: ${authError.message}`);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
      details: error.message,
    });
  }
});

/**
 * Deletes all user-related data in the correct order to satisfy foreign key constraints.
 */
async function deleteUserData(userId, listIds) {
  try {
    // 1️⃣ Delete dependent records first
    if (listIds.length > 0) {
      await supabase.from("Activity").delete().in("listId", listIds);
      await supabase.from("PlacesInLists").delete().in("listId", listIds);
      await supabase.from("Members").delete().in("listId", listIds);
    }

    // 2️⃣ Delete lists (once all references are gone)
    if (listIds.length > 0) {
      await supabase.from("Lists").delete().eq("userId", userId);
    }

    // 3️⃣ Delete other references to user (Following & Profiles)
    await supabase.from("Following").delete().or(`followerId.eq.${userId}, followingId.eq.${userId}`);
    await supabase.from("Profiles").delete().eq("userId", userId);
  } catch (error) {
    throw new Error(`Failed to delete user-related data: ${error.message}`);
  }
}

module.exports = router;
