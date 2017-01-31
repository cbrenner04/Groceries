# frozen_string_literal: true
module Pages
  class Item < Page
    def fill_in_name_with(name)
      fill_in "Name", with: name
    end

    def fill_in_quantity_with(quantity)
      fill_in "Quantity", with: quantity
    end

    def submit
      click_on "Submit"
    end

    def destroy_item(item)
      find(".card", text: item)
        .find(".btn", text: "Destroy")
        .click
    end

    def load_edit(item, list)
      visit edit_item_path(item, list_id: list.id)
    end
  end
end
