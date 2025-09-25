# Requirements Document

The **treasure-trove** project will implement a rudimentary proof-of-concept online marketplace platform for users to view, bid on and purchase various items up for auction.

## Use Cases

![diagram of the use cases for various roles in the marketplace system](./_assets/use-case-diagram.png)

### Unregistered Users

The only action unregistered users (i.e. users without an active account) can take is to **create an account** in the system. Users are not able to interact with any of the core features of the platform until they have created an account.

### Registered Users

Once a user has an account, they are able to access the core features of the site.

Registered users can perform all of the following actions.

#### Log in

This is the first action a registered user will take when visiting the platform. In the same way that unregistered users cannot access any features of the site until they create an account and log in, users who already have an account still must log in before gaining access to the platform.

#### Add Auction Items

Logged in users can add auction items for other platform users to view and bid on.

The following information is required to add a new item:

- Name of the item
- Description of the item
- Pictures of the item
- Minimum bid (tokens)
- Auction length (days)

#### View All Auctions

Logged in users will be able to view all auction items available for bid on the platform, including their own items. This view will only show the important details, such as the name and main picture of the item and the time remaining in the auction.

#### View Auction Details

Logged in users will be able to select a particular item up for auction to view more details about it. This view will show all details of the item (name, description, picture) in addition to all details of the auction, including time remaining, current bid, and bidding history.

The bidding history shall update in real-time as other users bid on the item. It will display the amount, date, and user for each bid.

#### Bid on Auctions

Logged in users will be able to make bids on an auction from the item's details page. Bids will be made with a user's available tokens. If a user does not have enough tokens to make a bid then the bidding UX will be unavailable for that auction.

#### View Purchased Items

Logged in users will be able to view a history of all items they've purchased in the past. This view will include all of the details and bidding history for each item. It will function similarly to the [active auctions view](#view-all-auctions), except it will show purchased items instead of active auctions.

### Administrators

There will be certain administrative privileges reserved for the site managers.

The administrator role will be hardcoded for the managers' accounts. There is no way for a regular registered user to become an admin or access any admin tools.

#### User Management

Administrators will have the ability to view a list of all users in the platform and lock or remove any users who have been abusing the platform.

#### Auction Management

Administrators will have the ability to lock or remove any active auctions if they determine that an item is unsuitable for the platform or contains illegal or explicit content or products.

#### Token Management

Administrators will have the ability to gift more tokens to users. This will be done purely at the administrators' discretion.

Administrators will not be able to take tokens away once they are given. If a user is abusing the platform then the best way to mitigate the problem will be to [lock the user](#user-management).

#### Sequence Diagram - Adding Auction Item

The Following contains the Communication Diagram for a user who is registered and would like to add an item for auction. 

<img width="571" height="432" alt="CPS 490 - Communication Diagram drawio" src="https://github.com/user-attachments/assets/a1eb4b54-6a0a-424e-b73b-b61ad3e22953" />

#### Activity Diagram - Adding Auction Item

The Following contains the Activity Diagram for a user who is registered and would like to add an item for auction. The Only way to proceed to posting your iten is to have all the required fields filled out. 

<img width="421" height="521" alt="CPS 490 - Activity Diagram drawio" src="https://github.com/user-attachments/assets/5ff66213-0941-48f6-ac83-f78b8c96edcf" />



