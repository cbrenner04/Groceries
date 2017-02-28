# Groceries

Check out the production version at <https://cjb-groceries.herokuapp.com>.

You will need to sign up to use the app.

Once signed up you can create a list. Lists can be shared between users.

From there you can perform all CRUD functionality for items for the list.

You will notice when adding items to the list you can either add a new item or
choose from previously added items. Because of this feature items are soft-
deleted. They will no long appear in the list but they are not actually deleted
from the database so that they are still available in the previously added
dropdown. Similarly lists can only be soft-deleted as items are related to lists
and if a list is deleted it would delete the items.

Please submit an issue if you find one.

## Todos

* Update front-end to use React.
  * Currently the page needs to reload to tell when items have been purchased or
    not. This can make decision making a little difficult if multiple parties
    are shopping at the same time.
* Update front-end UI.
  * Gestures for updating items in list. Swipe left for purchased or right for
    deleted, click to edit. There should be settings for preferred gestures.
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
