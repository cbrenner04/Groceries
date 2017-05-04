# frozen_string_literal: true

# no doc
class ListPresenter < SimpleDelegator
  def last_item_update
    return unless items.any?
    items.last.updated_at.to_formatted_s(:long)
  end
end
