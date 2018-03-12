# frozen_string_literal: true

module Pages
  class List < Page
    def has_non_purchased_item?(name)
      has_css? "div[data-test-class='non-purchased-item']", text: name
    end

    def has_purchased_item?(name)
      has_css? "div[data-test-class='purchased-item']", text: name
    end

    def name_input
      find("input[name='itemName']")
    end

    def quantity_input
      find("input[name='quantity']")
    end

    def quantity_name_input
      find("input[name='quantityName']")
    end

    def submit_button
      find("input[type='submit']")
    end

    def item_name_input
      find("input[name='itemName']")
    end

    def item_quantity_input
      find("input[name='itemQuantity']")
    end

    def item_quantity_name_input
      find("input[name='itemQuantityName']")
    end
  end
end
