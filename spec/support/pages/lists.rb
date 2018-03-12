# frozen_string_literal: true

module Pages
  class Lists < Page
    def has_non_completed_list?(title)
      has_css? "div[data-test-class='non-completed-list']", text: title
    end

    def has_completed_list?(title)
      has_css? "div[data-test-class='completed-list']", text: title
    end

    def name_input
      find("input[name='listName']")
    end

    def submit_button
      find("input[type='submit']")
    end
  end
end
