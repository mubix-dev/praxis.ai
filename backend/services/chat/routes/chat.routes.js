import express from 'express';
import {
    createConversation,
    createMessage,
    getALLConversations,
    getALLMessages,
    updateConversationTitle,
    deleteConversation
} from "../controllers/chat.controller.js"; // Adjust path to your controller file


const router = express.Router();

router.post('/conversations', createConversation);
router.get('/conversations', getALLConversations);
router.patch('/conversations/:conversationId', updateConversationTitle);
router.delete('/conversations/:conversationId', deleteConversation);

router.post('/messages', createMessage);
router.get('/conversations/:conversationId/messages', getALLMessages); 

export default router;