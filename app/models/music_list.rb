# frozen_string_literal: true

# no doc
class MusicList < List
  has_many :music_list_items, dependent: :destroy

  def icon
    "fa-music"
  end
end
