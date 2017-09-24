# frozen_string_literal: true

# no doc
class ToDoList < List
  has_many :to_do_list_items, dependent: :destroy

  def icon
    "fa-list"
  end
end
