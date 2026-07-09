import express from "express";
import Thread from "../models/Thread.js"
import getGeminiAIAPIResponse from "../utils/geminiai.js";

const router = express.Router();

// test
router.post("/test", async(req, res)=>{
    try {
        const thread = new Thread({
            userId: req.user.userId,
            threadId: "ABC",
            title: "Testing New Route 2"
        });

        const response = await thread.save();
        res.send(response);
        
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save  in DB"});
    }
})
 
// TO GET ALL THREADS
router.get("/thread", async(req, res) => { 
    try {
        const threads = await Thread.find({ userId: req.user.userId }).sort(({updatedAt: -1})); // all thread comes
        // Descending order of updatedAT // most recent data on top
        res.json(threads);

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch"});
    }
}); 

router.get("/thread/:threadId", async (req, res) => {
    // match threadId to the parameter
    const {threadId} = req.params; 

    try {
        const thread = await Thread.findOne({threadId, userId: req.user.userId});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    // fetch the threadId
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, userId: req.user.userId})

        if(!deletedThread) {
            return res.status(404).json({error: "Chat not found"})
        }

        res.status(200).json({success: "Chat deleted successfully"})

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete chat"});
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message} = req.body;

    // validate threadId
    if(!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        })
    }

    try {
        // find threadId
        let thread = await Thread.findOne({ threadId });

        if (thread && String(thread.userId) !== String(req.user.userId)) {
            return res.status(403).json({ error: "You are not allowed to access this chat" });
        }

        // create new thread if not found
        if(!thread) {
            
            thread = new Thread({
                userId: req.user.userId,
                threadId,
                title: message,
                messages: [
                    { 
                        role: "user", 
                        content: message 
                    }
                ]
            })
        } else {
            // push new message in thread
            thread.messages.push({
                role: "user", 
                content: message
            });
        }

        const assistantReply = await getGeminiAIAPIResponse(message);

        // reply stored in the database
        thread.messages.push({ 
            role: "assistant", 
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save(); 

        // reply send to the frontend
        res.json({reply: assistantReply});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Something went wrong"});
    }
})


export default router;