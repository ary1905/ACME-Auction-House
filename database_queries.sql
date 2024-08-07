-- Create the users table
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT
);

-- Create the auction_items table
CREATE TABLE public.auction_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    starting_bid NUMERIC(10,2) NOT NULL,
    end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    user_id INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auction_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Create the bids table
CREATE TABLE public.bids (
    id SERIAL PRIMARY KEY,
    auction_item_id INTEGER,
    user_id INTEGER,
    bid_amount NUMERIC(10,2) NOT NULL,
    bid_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bids_auction_item_id_fkey FOREIGN KEY (auction_item_id) REFERENCES public.auction_items(id) ON DELETE CASCADE,
    CONSTRAINT bids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create the triggers

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at column before any update on auction_items
CREATE TRIGGER update_auction_items_modtime
BEFORE UPDATE ON public.auction_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Function to update the starting_bid of an auction item when a new bid is placed
CREATE OR REPLACE FUNCTION update_starting_bid()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.auction_items
    SET starting_bid = NEW.bid_amount
    WHERE id = NEW.auction_item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update_starting_bid function after a new bid is inserted
CREATE TRIGGER after_bid_insert
AFTER INSERT ON public.bids
FOR EACH ROW
EXECUTE FUNCTION update_starting_bid();
