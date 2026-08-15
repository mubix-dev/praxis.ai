import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized: Missing user ID header" });
    }

    const conversation = await Conversation.create({ userId });

    return res.status(201).json(conversation);
  } catch (error) {
    console.error("createConversation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getALLConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized: Missing user ID header" });
    }

    const conversations = await Conversation.find({ userId }).sort({
      updatedAt: -1,
    });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("getALLConversations error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { title },
      { new: true },
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("updateConversationTitle error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images, artifact } = req.body;

    if (!conversationId || !role || !content) {
      return res.status(400).json({ message: "Incomplete Information" });
    }

    const validRoles = ["user", "assistant"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

    const conversationExists = await Conversation.findById(conversationId);
    if (!conversationExists) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await Message.create({
      conversationId,
      role,
      content,
      images,
      artifact
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("createMessage error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getALLMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("getALLMessages error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndDelete(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await Message.deleteMany({ conversationId });

    return res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("deleteConversation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
