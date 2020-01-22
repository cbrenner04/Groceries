# frozen_string_literal: true

require "rails_helper"

RSpec.describe MusicList do
  let(:user) { create :user }
  let(:list) { create :music_list, owner: user }
  let(:other_list) { create :music_list, owner: user }

  before do
    create :music_list_item, music_list: list, category: "foo"
    create :music_list_item, music_list: other_list, category: "bar"
  end

  describe ".categories" do
    it "returns categories for current list" do
      expect(list.categories).to include "foo"
      expect(list.categories).not_to include "bar"
    end
  end
end
