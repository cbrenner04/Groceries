# frozen_string_literal: true

# no doc
class MusicList < List
  has_many :music_list_items, dependent: :destroy

  def categories
    music_list_items.map(&:category).concat([
      'Blues', 'Comedy', 'Country', 'Electronic', 'Folk', 'Hip hop', 'Jazz',
      'Latin', 'Pop', 'R&B', 'Rock',
    ]).uniq.compact.reject(&:empty?).sort
  end
end
