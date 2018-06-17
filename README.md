# Groceries

Check out the production version at <https://www.groceries-app.com>.

Signing up has been removed. If you would like access to the app please email me
at cbrenner265@gmail.com.

Once signed up you can create a list. Lists can be shared between users.

From there you can perform all CRUD functionality for items for the list.

Please submit an issue if you find one.

## Development

Seed data can be found in `db/seeds.rb`.

Setup the database:

```
rails db:setup
```

Build the front end and watch for changes:

```
sh -c 'rm app/assets/webpack/* || true && cd client && yarn run build:development'
```

In a separate terminal, run the server:

```
rails s
```

You can sign in using any of the users in the seeds file listed above.

## Todos

* Update front-end UI.
  * Sort options for items on list and for lists. Suggested options would be:
    * Alphabetically
    * By department
      * This would require adding department attribute to items
    * Quantity
* Notifications
  * Reminders for going to the store / remembering to bring coupons, etc
  * Email a list to a friend who is not signed up and ask them to sign up
* Administrator Dashboard

## Expansion Ideas

* Integrate API of retailers so users can see what is available
  * This could utilize location services to better pinpoint the retailers
* Set up analytics to understand buying habits / increase retailer ordering
  confidence
* Add ability to order items for pick up at the store in the future
