# frozen_string_literal: true

# no doc
class GroceryList < List
  has_many :grocery_list_items, dependent: :destroy

  def categories
    grocery_list_items.map(&:category).concat(
      [
        "Alcohol", "Baby", "Bakery", "Baking", "Beverages",
        "Canned Goods & Soups", "Cereal", "Cleaning Supplies", "Condiments",
        "Dairy", "Deli", "Flowers", "Frozen Foods", "Grains, Pasta & Sides",
        "Health & Beauty", "International", "Meat & Seafood", "Paper Products",
        "Pet", "Pharmacy", "Produce", "Snacks", "Spices"
      ]
    ).uniq.compact.reject(&:empty?).sort
  end
end
