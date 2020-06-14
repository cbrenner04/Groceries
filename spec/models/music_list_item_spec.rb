# frozen_string_literal: true

require "rails_helper"

RSpec.describe MusicListItem, type: :model do
  let(:item) { create :music_list_item, album: "a", artist: "a", title: "a" }
  let(:another_item) do
    create :music_list_item, album: "b", artist: "a", title: "b"
  end
  let(:third_item) do
    create :music_list_item, album: "b", artist: "a", title: "a"
  end

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid when user is blank" do
      item.user = nil
      expect(item).not_to be_valid
    end

    it "is invalid when title, artist, and album are blank" do
      item.title = nil
      item.artist = nil
      item.album = nil
      expect(item).not_to be_valid
    end

    it "is valid when title is blank" do
      item.title = nil
      expect(item).to be_valid
    end

    it "is valid when album is blank" do
      item.album = nil
      expect(item).to be_valid
    end

    it "is valid when artist is blank" do
      item.artist = nil
      expect(item).to be_valid
    end

    it "is invalid when purchased is blank" do
      item.purchased = nil
      expect(item).not_to be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by artist then album then title" do
      expect(described_class.ordered).to eq [item, third_item, another_item]
    end
  end

  describe "#archive" do
    it "archives item" do
      expect(item.archived_at).to be_nil
      item.archive
      expect(item.archived_at).not_to be_nil
    end
  end
end
