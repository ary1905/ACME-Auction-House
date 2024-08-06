const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();


/******************************************** Initialize Express app and HTTP server *************************************************/
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});


/******************************************************* Middleware setup ***********************************************************/
app.use(express.json());
app.use(cors());


/****************************************************** Database pool setup *********************************************************/
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


/****************************************************** Email transporter setup ******************************************************/
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


/************************************************** Middleware for token authentication **********************************************/
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};


/********************************************* ### User Authentication Functionalities ### ******************************************/
app.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, is_verified, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [first_name, last_name, email, hashedPassword, false, verificationToken]
        );

        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please verify your email',
            html: `<p>Click <a href="${verificationLink}" target="_blank">here</a> to verify your email.</p>`,
        });

        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'An error occurred while signing up' });
    }
});

app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const result = await pool.query(
            'UPDATE users SET is_verified = $1, verification_token = $2 WHERE email = $3 RETURNING id',
            [true, null, email]
        );
        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'An error occurred while verifying the email' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!user.is_verified) {
            return res.status(403).json({ error: 'Email not verified' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

app.get('/protected', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
});





/*************************************************** ### Bidding Functionalities ### ************************************************/
app.post('/api/auction-items', authenticateToken, async (req, res) => {
    const { title, description, starting_bid, end_date, image_url } = req.body;
    const user_id = req.user.userId;
    try {
        const result = await pool.query(
            'INSERT INTO auction_items (title, description, starting_bid, end_date, image_url, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            [title, description, starting_bid, end_date, image_url, user_id]
        );
        const newItem = result.rows[0];
        io.emit('itemAdded', newItem); 
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding new auction item:', error);
        res.status(500).json({ error: 'An error occurred while adding the auction item' });
    }
});

app.get('/api/auction-items', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const auctionItemsResult = await pool.query(
            `SELECT ai.*
       FROM auction_items ai
       LEFT JOIN bids b ON ai.id = b.auction_item_id AND b.user_id = $1
       WHERE ai.user_id != $1 AND b.user_id IS NULL`,
            [userId]
        );
        res.status(200).json(auctionItemsResult.rows);
    } catch (error) {
        console.error('Error fetching auction items:', error);
        res.status(500).json({ error: 'An error occurred while fetching auction items' });
    }
});

app.get('/my-auction-items', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auction_items WHERE user_id = $1', [req.user.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching auction items:', error);
        res.status(500).json({ error: 'An error occurred while fetching auction items' });
    }
});

app.get('/api/bids', authenticateToken, async (req, res) => {
    const user_id = req.user.userId;
    try {
        const result = await pool.query(
            `SELECT bids.id AS bid_id, bids.bid_amount, bids.bid_time,
              auction_items.id AS auction_item_id, auction_items.title, auction_items.description,
              auction_items.end_date, auction_items.image_url
       FROM bids
       JOIN auction_items ON bids.auction_item_id = auction_items.id
       WHERE bids.user_id = $1
       ORDER BY bids.bid_time DESC`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ error: 'An error occurred while fetching bids' });
    }
});

const sendOutbidEmail = (recipientEmail, recipientName, itemTitle, auctionItemId, bidAmount) => {
    const mailOptions = {
        from: 'your-email@example.com',
        to: recipientEmail,
        subject: 'You have been outbid!',
        text: `Dear ${recipientName},

We wanted to inform you that you have been outbid on the auction item titled "${itemTitle}". The new highest bid is ${bidAmount}.

We encourage you to visit the auction and place a higher bid to win the item. Thank you for your participation in our auction.
You can view the auction item and place a higher bid by visiting the following link:
http://localhost:3000/

Best regards,
ACME Auction House`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending outbid email:', error);
        } else {
            console.log('Outbid email sent:', info.response);
        }
    });
};

app.post('/api/bids', authenticateToken, async (req, res) => {
    const { auction_item_id, bid_amount } = req.body;
    const user_id = req.user.userId;
    try {
        const existingBidResult = await pool.query(
            'SELECT * FROM bids WHERE auction_item_id = $1 ORDER BY bid_amount DESC LIMIT 1',
            [auction_item_id]
        );
        let highestBid = existingBidResult.rows[0];
        if (highestBid && highestBid.bid_amount >= bid_amount) {
            return res.status(400).json({ error: 'Bid amount must be higher than the current highest bid.' });
        }
        
        const itemResult = await pool.query('SELECT title FROM auction_items WHERE id = $1', [auction_item_id]);
        const itemTitle = itemResult.rows[0].title;

        let newBidId;
        if (highestBid) {
            const previousBidderResult = await pool.query(
                'SELECT email, first_name FROM users WHERE id = $1',
                [highestBid.user_id]
            );
            const previousBidderEmail = previousBidderResult.rows[0].email;
            const previousBidderName = previousBidderResult.rows[0].first_name;

            await pool.query(
                'UPDATE bids SET user_id = $1, bid_amount = $2, bid_time = NOW() WHERE id = $3',
                [user_id, bid_amount, highestBid.id]
            );
            newBidId = highestBid.id;

            sendOutbidEmail(previousBidderEmail, previousBidderName, itemTitle, auction_item_id, bid_amount);
        } else {
            const insertBidResult = await pool.query(
                'INSERT INTO bids (auction_item_id, user_id, bid_amount, bid_time) VALUES ($1, $2, $3, NOW()) RETURNING id',
                [auction_item_id, user_id, bid_amount]
            );
            newBidId = insertBidResult.rows[0].id;
        }
        await pool.query(
            'UPDATE auction_items SET starting_bid = $1 WHERE id = $2',
            [bid_amount, auction_item_id]
        );

        const updatedItemResult = await pool.query('SELECT * FROM auction_items WHERE id = $1', [auction_item_id]);
        const updatedItem = updatedItemResult.rows[0];
        io.emit('updateAuctionItems', updatedItem);

        res.status(201).json({ message: 'Bid placed successfully.' });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'An error occurred while placing the bid' });
    }
});

app.put('/api/auction-items/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, starting_bid, end_date, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auction_items SET title = $1, description = $2, starting_bid = $3, end_date = $4, image_url = $5, updated_at = NOW() WHERE id = $6 AND user_id = $7 RETURNING *',
            [title, description, starting_bid, end_date, image_url, id, req.user.userId]
        );
        const updatedItem = result.rows[0];
        io.emit('itemUpdated', updatedItem);
        res.status(200).json({ message: 'Auction item updated successfully' });
    } catch (error) {
        console.error('Error updating auction item:', error);
        res.status(500).json({ error: 'An error occurred while updating the auction item' });
    }
});

app.delete('/api/auction-items/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM auction_items WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
        io.emit('itemDeleted', { id });
        res.status(204).json({ message: 'Auction item deleted successfully' });
    } catch (error) {
        console.error('Error deleting auction item:', error);
        res.status(500).json({ error: 'An error occurred while deleting the auction item' });
    }
});




/*************************************************** ### User Functionalities  ### ************************************************/

// Route to fetch user details (for the current user)
// This route retrieves the details of the current user.
app.get('/user-details', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT first_name, last_name FROM users WHERE id = $1', [req.user.userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
});



/*************************************************** ### Socket.IO Functionalities ### ************************************************/
// Socket.IO connection event
// This event handles user connections and disconnections for real-time updates.
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        
    });
});


/****************************************************** ### Start the server ### ******************************************************/
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
