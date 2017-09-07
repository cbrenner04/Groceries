# frozen_string_literal: true

# no doc
class MusicListItem < ApplicationRecord
  belongs_to :user
  belongs_to :music_list
end
