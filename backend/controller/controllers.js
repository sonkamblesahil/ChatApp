// Get all users and the latest message from each user for the logged-in user
import User from "../models/user.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";


export async function getUsersWithLatestMessages(req, res) {
    try {
        const { username } = req.params;
        const currentUser = await User.findOne({ username });
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const users = await User.find({ _id: { $ne: currentUser._id } });
        const results = await Promise.all(users.map(async (user) => {
            const conversation = await Message.findOne({
                participants: { $all: [currentUser._id, user._id] }
            });
            let latestMessage = null;
            if (conversation && conversation.messages.length > 0) {
                latestMessage = conversation.messages[conversation.messages.length - 1].content;
            }
            return {
                username: user.username,
                latestMessage
            };
        }));
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function homePage(req, res) {
    try {
        const users = await User.find();
        const userChats = await Chat.find({ users: { $in: users.map(user => user._id) } });
        res.json({ users, chats: userChats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function signup(req, res) {
    try {
        console.log('Signup request received:', req.body);
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'All fields are required.' });
        }
        console.log('Checking for existing user with username:', username, 'or email:', email);
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists:', existingUser.username);
            return res.status(409).json({ error: 'Email or username already exists.' });
        }
        console.log('Creating new user');
        const new_user = new User({ username, email, password });
        await new_user.save();
        console.log('User created successfully:', new_user.username);
        res.status(201).json({ message: 'User registered successfully', user: new_user });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function signin(req,res){
    try {
        console.log('Signin request received:', req.body);
        const {username,password} = req.body
        if(!username || !password){
            console.log('Missing username or password');
            return res.status(400).json({error: 'All fields are required.'});
        }
        console.log('Looking for user:', username);
        const user = await User.findOne({username});
        if(!user){
            console.log('User not found:', username);
            return res.status(404).json({error: 'User not found.'});
        }
        console.log('User found, comparing password');
        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);
        if(!isMatch){
            console.log('Password does not match');
            return res.status(401).json({error: 'Invalid credentials.'});
        }
        console.log('Signin successful for user:', username);
        res.status(200).json({message: 'Signin successful', user});
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({error: error.message});
    }
}

export async function searchusers(req,res){
    try{
        const username = req.params.username
        const users = await User.find({ username: { $regex: username, $options: 'i' } });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function sendmessage(req,res){
try {
    const { from, to } = req.params;
    const { message } = req.body;
    
    // Look up ObjectIds for usernames
    const fromUser = await User.findOne({ username: from });
    const toUser = await User.findOne({ username: to });
    if (!fromUser || !toUser) {
        return res.status(404).json({ error: 'User(s) not found.' });
    }
    
    // Find the conversation between the two users
    let conversation = await Message.findOne({
        participants: { $all: [fromUser._id, toUser._id] }
    });
    if (!conversation) {
        // Create a new conversation if it doesn't exist
        conversation = new Message({
            participants: [fromUser._id, toUser._id],
            messages: []
        });
    }
    
    // Create message object
    const newMessage = {
        sender: fromUser._id,
        content: message,
        messageType: 'text',
        timestamp: new Date()
    };
    
    // Push the new message into the messages array
    conversation.messages.push(newMessage);
    await conversation.save();
    
    res.status(201).json({ message: 'Message sent successfully', conversation });
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

export async function getConversation(req, res) {
  try {
    const { from, to } = req.params;

    const fromUser = await User.findOne({ username: from });
    const toUser = await User.findOne({ username: to });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User(s) not found." });
    }

    // Find the conversation between these two users
    let conversation = await Message.findOne({
      participants: { $all: [fromUser._id, toUser._id] }
    });

    if (!conversation) {
      return res.json({ messages: [] });
    }

    // Populate sender info manually
    const msgs = await Promise.all(conversation.messages.map(async (m) => {
      const sender = await User.findById(m.sender);
      return {
        sender: sender ? sender.username : 'Unknown',
        content: m.content,
        messageType: m.messageType || 'text',
        timestamp: m.timestamp
      };
    }));

    res.status(200).json({ messages: msgs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
