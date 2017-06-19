# frozen_string_literal: true

module Pages
  class List < Page
    def fill_in_name_with(name)
      fill_in "name", with: name
    end

    def fill_in_edit_name_with(name)
      fill_in "Name", with: name
    end

    def create_list
      click_on "Create List"
    end

    def submit
      click_on "Submit"
    end

    def load_index
      visit lists_path
    end

    def load_list(list)
      visit list_path(list)
    end

    def has_list?(title)
      has_css? ".list-group-item", text: title
    end

    def has_list_title?(title)
      has_css? "h1", text: title
    end

    def has_item?(item)
      has_css? ".list-group-item", text: item
    end

    def first_list
      first(".list-group-item")
    end

    def add_item
      find("input[type='submit']").click
    end

    def share_list(name)
      find(".list-group-item", text: name)
        .find(".fa-users").click
    end

    def edit_list(name)
      find(".list-group-item", text: name)
        .find(".fa-pencil-square-o").click
    end

    def destroy_list(name)
      find(".list-group-item", text: name)
        .find(".fa-trash").click
    end

    def fill_in_new_item_quantity(quantity)
      find("input[name='quantity']").set(quantity)
    end

    def fill_in_new_item_quantity_type(quantity_name)
      find("input[name='quantity_name']").set(quantity_name)
    end

    def fill_in_new_item_name(name)
      find("input[name='name']").set(name)
    end
  end
end
