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
      has_css? ".card", text: item
    end

    def first_list
      first(".list-group-item")
    end

    def add_item
      click_on "Add item to list"
    end

    def share_list
      click_on "Share list"
    end

    def edit_list
      click_on "Options"
      first("a", text: "Edit").click
    end

    def destroy_list
      click_on "Options"
      first("a", text: "Destroy").click
    end
  end
end
