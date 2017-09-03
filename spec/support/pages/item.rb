# frozen_string_literal: true

module Pages
  class Item < Page
    def fill_in_new_name_with(name)
      fill_in "Add a new item", with: name
    end

    def select_item(name)
      select name, from: "Or select an item from another list"
    end

    def fill_in_quantity_with(quantity)
      fill_in "Quantity", with: quantity
    end

    def submit
      click_on "Update Item"
    end

    def destroy_item(item)
      find(".list-group-item", text: item)
        .find(".fa-trash")
        .click
    end

    def load_edit(item, list)
      visit edit_list_item_path(item, list_id: list.id)
    end
  end
end
