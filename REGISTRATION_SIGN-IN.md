# Registration and Sign-in document

## Use Cases

![diagram of the use cases for registering an account and or signing in the marketplace system](./_assets/d1.png)

### Unregistered Users

The only action unregistered users (i.e. users without an active account) can take is to **create an account** in the system. Users are not able to interact with any of the core features of the platform until they have created an account.

### Input Username

Input validation for the username which will be logged to the database.

#### Password

Input validation for the username which will be logged to the database.

#### Login

This is the first action a registered user will take when visiting the platform. In the same way that unregistered users cannot access any features of the site until they create an account and log in, users who already have an account still must log in before gaining access to the platform.

#### Login Authenticated

Correct Username and password corresponding to the database will log the user in and bring them to the homepage of the marketplace.

#### Login Fail

The user will not be able to be authenticated until credentials match in the database. They will have to keep inputting.

#### Try again

Page will prompt fail and erase input. User will be at the login page again.

#### Admin Login

The admins will have their own credentials to login to but will have more priviledge with the pages they can access. 