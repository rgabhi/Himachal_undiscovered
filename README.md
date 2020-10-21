# Himachal Undiscovered
- Himachal Undiscovered is a web-app for enhancing tourism in unexplored places of Himachal Pradesh.It let's user to add and review undiscovered places in Himachal.  In order to review or create a place, one must have an account.

- This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features
- Users can add, edit, and remove places.
- Users can comment on places once, and can edit or delete their comments.
- User haves seprate profile pages which include more information about them like full name, email, phone, join date, places added by them, and the option to edit their profile or delete their account.
- One can search a place by author-name or by location.
- One can sort places by highest rating, most reviewes, and prices.

## How to run locally
1.Install mongodb
2. Create a cloudinary account to get an API key and secret code

3. Ru the following commands:
   * git clone https://github.com/rgabhi/Himachal_undiscovered.git
   * cd Himachal_undiscovered
   * npm install
   
4. Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

  * DATABASEURL='<url>'
  * API_KEY=''<key>
  * API_SECRET='<secret>'
5. Run mongod in another terminal and node app.js in the terminal with the project.

6. Then go to localhost:3001.





