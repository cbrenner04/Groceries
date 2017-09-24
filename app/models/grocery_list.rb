# frozen_string_literal: true

# no doc
class GroceryList < List
  has_many :grocery_list_items, dependent: :destroy

  def icon
    "fa-shopping-bag"
  end
end
